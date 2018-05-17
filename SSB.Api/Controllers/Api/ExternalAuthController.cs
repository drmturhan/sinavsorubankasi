using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Core.Base;
using Core.EntityFramework;
using Core.EntityFramework.Factories;
using Identity.DataAccess;
using Identity.DataAccess.Dtos;
using Identity.DataAccess.Helpers;
using Identity.DataAccess.Mappers;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace Psg.Api.Controllers.Api
{
    [Route("api/[controller]/[action]")]
    public class ExternalAuthController : Controller
    {
        private readonly MTIdentityDbContext _appDbContext;
        private readonly KullaniciYonetici _userManager;
        private readonly SignInManager<Kullanici> signInManager;
        private readonly FacebookAuthSettings _fbAuthSettings;
        private readonly IJwtFactory _jwtFactory;
        private readonly JwtIssuerOptions _jwtOptions;
        private static readonly HttpClient Client = new HttpClient();

        public ExternalAuthController(IOptions<FacebookAuthSettings> fbAuthSettingsAccessor,
            KullaniciYonetici userManager,
            SignInManager<Kullanici> signInManager,
            MTIdentityDbContext appDbContext,
            IJwtFactory jwtFactory,
            IOptions<JwtIssuerOptions> jwtOptions)
        {
            _fbAuthSettings = fbAuthSettingsAccessor.Value;
            _userManager = userManager;
            this.signInManager = signInManager;
            _appDbContext = appDbContext;
            _jwtFactory = jwtFactory;
            _jwtOptions = jwtOptions.Value;
        }

        // POST api/externalauth/facebook
        [HttpPost]
        public async Task<IActionResult> Facebook([FromBody]FacebookAuthDto model)
        {
            // 1.generate an app access token
            var appAccessTokenResponse = await Client.GetStringAsync($"https://graph.facebook.com/oauth/access_token?client_id={_fbAuthSettings.AppId}&client_secret={_fbAuthSettings.AppSecret}&grant_type=client_credentials");
            var appAccessToken = JsonConvert.DeserializeObject<FacebookAppAccessToken>(appAccessTokenResponse);
            // 2. validate the user access token
            var userAccessTokenValidationResponse = await Client.GetStringAsync($"https://graph.facebook.com/debug_token?input_token={model.AccessToken}&access_token={appAccessToken.AccessToken}");
            var userAccessTokenValidation = JsonConvert.DeserializeObject<FacebookUserAccessTokenValidation>(userAccessTokenValidationResponse);

            if (!userAccessTokenValidation.Data.IsValid)
            {
                return BadRequest(Errors.AddErrorToModelState("login_failure", "Invalid facebook token.", ModelState));
            }

            // 3. we've got a valid token so we can request user data from fb
            var userInfoResponse = await Client.GetStringAsync($"https://graph.facebook.com/v2.8/me?fields=id,email,first_name,last_name,name,gender,locale,birthday,picture&access_token={model.AccessToken}");
            var facebookUserInfo = JsonConvert.DeserializeObject<FacebookUserData>(userInfoResponse);

            // 4. ready to create the local user account (if necessary) and jwt
            var user = await _userManager.KullaniciyiGetirEpostayaGore(facebookUserInfo.Email);

            string mesaj = string.Empty;
            if (user == null)
            {
                user = new Kullanici()
                {

                    UserName = facebookUserInfo.Email,
                    Email = facebookUserInfo.Email,
                    EmailConfirmed = false,
                    YaratilmaTarihi = DateTime.Now,
                    Pasif = true,
                    Yonetici = false,
                    FacebookId = facebookUserInfo.Id,
                    //FaceBookPictureUrl = userInfo.Picture.Data.Url
                };
                user.Kisi = new KullaniciKisi
                {
                    Unvan = "Doç.Dr.",
                    Ad = facebookUserInfo.FirstName,
                    Soyad = facebookUserInfo.LastName,
                    CinsiyetNo = 1,

                    DogumTarihi = new DateTime(1970, 11, 15)
                };
                KisiyeFacebookFotografiEkle(facebookUserInfo, user);
                var result = await _userManager.CreateAsync(user, Convert.ToBase64String(Guid.NewGuid().ToByteArray()).Substring(0, 8));

                if (!result.Succeeded)
                {
                    return Ok(Sonuc.Basarisiz(new Hata[] { new Hata { Kod = "", Tanim = "Facebook bilgileriyle kullanıcı yaratılamadı!" } }));
                }
                else
                    mesaj = "Facebook kullanıcısı yaratıldı. Hesabınız onay sürecinde. Lütfen Eposta adresinizi kontrol ediniz.";

            }
            else
            {
                bool kayitGerekli = false;
                if (user.FacebookId == null || user.FacebookId != facebookUserInfo.Id)
                {
                    //user.Pasif = true;
                    //user.EmailConfirmed = false;
                    if (facebookUserInfo.Gender == "male")
                        user.Kisi.CinsiyetNo = 1;
                    else if (facebookUserInfo.Gender == "female")
                        user.Kisi.CinsiyetNo = 2;

                    kayitGerekli = true;
                }

                var facebookFotograflari = user.Kisi.Fotograflari.Where(f => f.DisKaynakId == "facebook").ToList();
                var facebookFotografiYok = facebookFotograflari != null && !facebookFotograflari.Any(fb => fb.Url == facebookUserInfo.Picture.Data.Url);

                var suankiProfilFotografi = user.Kisi.Fotograflari.SingleOrDefault(f => f.ProfilFotografi);
                if (suankiProfilFotografi != null)
                {
                    suankiProfilFotografi.ProfilFotografi = false;
                    kayitGerekli = true;
                }

                if (facebookFotografiYok)
                {
                    KisiyeFacebookFotografiEkle(facebookUserInfo, user);
                    kayitGerekli = true;
                }


                if (kayitGerekli)
                {
                    var degistirmeSonuc = await _userManager.UpdateAsync(user);
                    if (!degistirmeSonuc.Succeeded)
                        return Ok(Sonuc.Basarisiz(new Hata[] { new Hata { Kod = "", Tanim = "Facebook bilgileriyle kullanıcı kaydedilemedi!" } }));
                    else
                        mesaj = "Facebook bilgileriyle kullanıcı var olan kullanıcı ilişkilendirildi. Hesabınızı onaylanması gerekli. Lütfen eposta adresinizi kontrol ediniz.";
                }

            }

            // generate the jwt for the local user...
            var localUser = await _userManager.KullaniciyiGetirEpostayaGore(facebookUserInfo.Email);



            if (localUser == null)
                return Ok(Sonuc.Basarisiz(new Hata[] { new Hata { Kod = "Giris Başarısız", Tanim = "Facebook bilgileriyle lokal kullanıcı hesabı yaratılamadı!" } }));

            var girisYapabilirSonuc = await signInManager.CanSignInAsync(localUser);

            if (girisYapabilirSonuc)

                if (!localUser.EmailConfirmed)
                {
                    //Eposta konfirme etme süreci başlasın
                }
            if (!localUser.Pasif)
            {
                //Aktifleştirme süreci başlasın
            }

            var jwt = await Tokens.GenerateJwt(_jwtFactory.GenerateClaimsIdentity(localUser),
              _jwtFactory, localUser.UserName, _jwtOptions);
            var kullaniciDto = user.ToKullaniciBilgi();

            var sonuc = KayitSonuc<object>.IslemTamam(new { tokenString = jwt, kullanici = kullaniciDto });

            sonuc.Mesajlar[0] = $"Hoşgeldiniz {kullaniciDto.TamAdi}!";
            sonuc.Mesajlar.Add(mesaj);
            return Ok(sonuc);
        }

        private static void KisiyeFacebookFotografiEkle(FacebookUserData facebookUserInfo, Kullanici user)
        {
            user.Kisi.Fotograflari.Add(new KisiFoto
            {

                Aciklama = "Facobook profil fotoğrafı",
                DisKaynakId = "facebook",
                EklenmeTarihi = DateTime.UtcNow,
                ProfilFotografi = true,
                Url = facebookUserInfo.Picture.Data.Url

            });
        }
    }
}
