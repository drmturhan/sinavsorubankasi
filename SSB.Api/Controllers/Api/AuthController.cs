using System;
using System.Threading.Tasks;
using AutoMapper;
using Identity.DataAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Psg.Api.Base;
using Psg.Api.Dtos;
using Psg.Api.Extensions;
using Core.Base;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.Extensions.Options;
using Core.EntityFramework;
using Identity.DataAccess.Dtos;
using Identity.DataAccess.Mappers;
using System.Collections.Generic;
using Core.Base.Hatalar;
using Core.EntityFramework.Factories;
using Newtonsoft.Json;
using Identity.DataAccess.Helpers;

namespace Psg.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/Account")]
    public class AuthController : MTSController
    {
        private readonly KullaniciYonetici userManager;
        private readonly SignInManager<Kullanici> signInManager;
        private readonly IEmailSender postaci;
        private readonly IJwtFactory jwtFactory;

        public JwtIssuerOptions uygulamaAyarlari { get; }

        public AuthController(
            KullaniciYonetici userManager,
            SignInManager<Kullanici> signInManager,
            IEmailSender postaci,
            IJwtFactory jwtFactory,
            IOptions<JwtIssuerOptions> uygulamaAyarConfig
            )
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.postaci = postaci;
            this.jwtFactory = jwtFactory;
            this.uygulamaAyarlari = uygulamaAyarConfig.Value;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("girisyap", Name = "GirisYap")]
        public async Task<IActionResult> GirisYap([FromBody] GirisDto girisBilgileri, string returnUrl)
        {
            return await HataKontrolluDondur<Task<IActionResult>>(async () =>
            {

                var kullaniciEntity = await userManager.KullaniciyiGetirKullaniciAdinaGoreAsync(girisBilgileri.KullaniciAdi);
                if (kullaniciEntity == null || kullaniciEntity.Pasif)
                {
                    Sonuc sonuc = Sonuc.Basarisiz(new Hata[] { new Hata { Kod = "", Tanim = "Kullanıcı yok veya aktif değil!" } });
                    return Ok(sonuc);
                }

                var result = await signInManager.PasswordSignInAsync(girisBilgileri.KullaniciAdi, girisBilgileri.Sifre, true, true);
                if (result.IsNotAllowed)
                {
                    Sonuc sonuc = Sonuc.Basarisiz(new Hata[] { new Hata { Kod = "", Tanim = "Kullanıcının giriş izni yok!" } });
                    return Ok(sonuc);
                }
                if (result.IsLockedOut)
                {
                    Sonuc sonuc = Sonuc.Basarisiz(new Hata[] { new Hata { Kod = "", Tanim = "Kullanıcı hesabı bloke!" } });
                    return Ok(sonuc);
                }
                if (result.RequiresTwoFactor)
                {
                    KayitSonuc<object> sonuc = KayitSonuc<object>.Basarisiz(new Hata[] { new Hata { Kod = "", Tanim = "Kullanıcı 2 faktörlü giriş için gerekli işlemler yapılmamış!" } });
                    return Ok(sonuc);
                }
                if (result.Succeeded)
                {
                    var identity = await GetClaimsIdentity(girisBilgileri, kullaniciEntity);
                    if (identity == null)
                    {
                        return Ok(KayitSonuc<object>.Basarisiz(new Hata[] { new Hata { Kod = "", Tanim = "Kullanıcı adı ve/veya şifre yanlış!" } }));

                    }
                    var jwt = Tokens.GenerateJwt(identity, jwtFactory, girisBilgileri.KullaniciAdi, uygulamaAyarlari);
                    var tokenString = jwt.Result;

                    var kullanici = kullaniciEntity.ToKullaniciBilgi();
                    kullanici.GecerlilikOmruDakika = (int)uygulamaAyarlari.ValidFor.TotalSeconds;
                    var sonuc = KayitSonuc<object>.IslemTamam(new { tokenString, kullanici, returnUrl });
                    sonuc.Mesajlar[0] = "Giriş başarılı";
                    sonuc.Mesajlar.Add($"Hoşgeldiniz {kullanici.TamAdi}!");
                    return Ok(sonuc);

                }
                return Ok(KayitSonuc<object>.Basarisiz(new Hata[] { new Hata { Kod = "", Tanim = "Kullanıcı adı ve/veya şifre yanlış!" } }));
            });

        }


        private async Task<ClaimsIdentity> GetClaimsIdentity(GirisDto girisBilgileri, Kullanici kullanici)
        {
            if (string.IsNullOrEmpty(girisBilgileri.KullaniciAdi) || string.IsNullOrEmpty(girisBilgileri.Sifre))
                return await Task.FromResult<ClaimsIdentity>(null);

            // get the user to verifty
            var userToVerify = kullanici;

            if (userToVerify == null) return await Task.FromResult<ClaimsIdentity>(null);

            // check the credentials
            if (await userManager.CheckPasswordAsync(userToVerify, girisBilgileri.Sifre))
            {
                return await Task.FromResult(jwtFactory.GenerateClaimsIdentity(kullanici));
            }

            // Credentials are invalid, or account doesn't exist
            return await Task.FromResult<ClaimsIdentity>(null);
        }


        [Route("cikisyap", Name = "CikisYap")]
        [Authorize(Policy = "ApiUser")]
        public async Task<IActionResult> CikisYap()
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {
                try
                {
                    await signInManager.SignOutAsync();
                    var sonuc = Sonuc.Tamam;
                    return Ok(sonuc);
                }
                catch (Exception hata)
                {
                    var sonuc = Sonuc.Basarisiz(hata);
                    return Ok(sonuc);
                }
            });

        }




        [HttpPost]
        [AllowAnonymous]
        [Route("uyelikbaslat")]
        public async Task<IActionResult> UyelikBaslat([FromBody]UyelikYaratDto model)

        {
            return await HataKontrolluDondur<Task<IActionResult>>(async () =>
            {
                if (ModelState.IsValid)
                {

                    var user = model.ToEntity();
                    user.YaratilmaTarihi = DateTime.Now;
                    IdentityResult result = null;

                    try
                    {
                        result = await userManager.CreateAsync(user, model.Sifre);
                        if (result.Succeeded)
                        {
                            await EPostaAktivasyonKoduPostala(user);
                            Sonuc sonuc = Sonuc.Tamam;
                            sonuc.Mesajlar.Add("Üyelik işlemi başlatıldı. Aktivasyon işlemleri için eposta gönderildi. Lütfen eposta adresinizi kontrol edin");
                            return Ok(sonuc);
                        }
                    }
                    catch (Exception hata)
                    {
                        return BadRequest(hata);
                    }

                    AddErrors(result);
                }

                return Ok(Sonuc.Basarisiz(new Hata[] { new Hata { Kod = "Üyelik başlatılamadı", Tanim = "Üyelik işleminiz başlatılamadı. Lütfen daha sonra tekrar deneyiniz..." } }));
            });
        }

        private async Task EPostaAktivasyonKoduPostala(Kullanici user)
        {

            var code = await userManager.GenerateEmailConfirmationTokenAsync(user);
            var callbackUrl = Url.EmailConfirmationLink(user.Id.ToString(), code, Request.Scheme);
            await postaci.SendEmailAsync(user.Email, "Soru bankası, kullanıcı eposta aktivasyonu", string.Format("Soru bankası kullanıcı hesabınızı aktifleştirmek için kullanıcıyı <a href=\"{0}\">onayla</a>", callbackUrl));
        }
        [AllowAnonymous]
        [Route("guvenlikkodudogrumu")]
        [HttpGet()]
        public async Task<IActionResult> GuvenlikKoduDogrumu([FromQuery]string kod)
        {
            return await HataKontrolluDondur<IActionResult>(async () =>
            {
                if (string.IsNullOrEmpty(kod.Trim()))
                    return BadRequest("Kod boş olamaz!");
                var sonuc = await userManager.KullaniciGuvenlikKoduDogrumu(kod);
                if (sonuc)
                    return Ok(sonuc);
                else
                    return BadRequest();

            });
        }


        [HttpGet]
        [AllowAnonymous]
        [Route("kullaniciepostasinionayla")]
        public async Task<IActionResult> ConfirmEmail(string userId, string code)
        {
            return await HataKontrolluDondur<Task<IActionResult>>(async () =>
            {
                if (userId == null || code == null)
                    return BadRequest("Kullanici bilgisi ve/veya kod yok!");

                var user = await userManager.FindByIdAsync(userId);
                if (user == null)
                    return BadRequest("Kullanıcı ve koda uyan kayt yok!");


                var result = await userManager.ConfirmEmailAsync(user, code);
                if (result.Succeeded)
                    return RedirectPermanent(string.Format("{0}uyelik/epostaonaylandi?kod={1}", uygulamaAyarlari.JwtIssuer, user.SecurityStamp));
                else
                    return RedirectPermanent(string.Format("{0}uyelik/epostaonaylanamadi", uygulamaAyarlari.JwtIssuer));
            });
        }
        [HttpGet]
        [AllowAnonymous]
        [Route("hesaponaykodupostala")]
        public async Task<IActionResult> YenidenKodGonder(string eposta)
        {
            return await HataKontrolluDondur<Task<IActionResult>>(async () =>
            {
                if (string.IsNullOrEmpty(eposta))
                {
                    return Ok(Sonuc.Basarisiz(new Exception("yanlış bilgi")));
                }
                Kullanici user = null;
                user = await userManager.KullaniciyiGetirEpostayaGore(eposta);
                if (user == null)
                {
                    return Ok(Sonuc.Basarisiz(new Exception("yanlış bilgi")));
                }
                if (user.Email != eposta)
                    return Ok(Sonuc.Basarisiz(new Exception("yanlış bilgi")));

                await EPostaAktivasyonKoduPostala(user);

                return Ok(Sonuc.Tamam);

            });
        }



        [AllowAnonymous]
        [HttpPost]
        [Route("sifrekurtarbaslat", Name = "SifreKurtarBaslat")]
        public async Task<IActionResult> SifreKurtar([FromBody] SifreKurtarBaslatDto sifreKurtarBaslat)
        {
            return await HataKontrolluDondur<Task<IActionResult>>(async () =>
            {

                var user = await userManager.KullaniciyiGetirEpostayaGore(sifreKurtarBaslat.Eposta);
                if (user == null || !(await userManager.IsEmailConfirmedAsync(user)))
                {
                    return Ok(Sonuc.Basarisiz(new Exception("Onaylı kullanıcı yok!")));
                }
                if (user.Pasif)
                {
                    return Ok(Sonuc.Basarisiz(new Exception("Onaylı kullanıcı yok!")));
                }


                // For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=532713
                // Send an email with this link
                var code = await userManager.GeneratePasswordResetTokenAsync(user);
                var callbackUrl = string.Format("{0}/uyelik/sifresifirla?code={1}", uygulamaAyarlari.JwtIssuer, code);// Url.ResetPasswordCallbackLink(user.Id.ToString(), code, HttpContext.Request.Scheme);


                await postaci.SendEmailAsync(user.Email, $"{user.UserName} için şifre kurtarma epostasi", "Şifre kurtarmaya devam etmek için <a href=\"" + callbackUrl + "\">tıklayınız.</a>");
                return Ok(Sonuc.Tamam);

            });

        }

        [HttpPost]
        [AllowAnonymous]
        [Route("sifrekurtar")]
        public async Task<IActionResult> ResetPassword([FromBody] SifreKurtarDto model)
        {
            return await HataKontrolluDondur<Task<IActionResult>>(async () =>
            {

                var user = await userManager.FindByEmailAsync(model.Eposta);
                if (user == null)
                {
                    return NotFound("Kullanıcı yok!");
                }
                var result = await userManager.ResetPasswordAsync(user, model.Kod, model.Sifre);
                if (result.Succeeded)
                {
                    return Ok(Sonuc.Tamam);
                }
                
                return Ok(Sonuc.Basarisiz(new Exception("Şifre değişmedi! Değiştirme süreniz bitmiş olabilir. Süreci yeniden başlatın!!")));
            });
        }

        //Profil Controllar a tasinacak
        //[HttpPost]
        //[Route("sifreyisifirla")]
        //public async Task<IActionResult> ChangePassword(SifreDegistirDto model)
        //{
        //    return await HataKontrolluDondur<Task<IActionResult>>(async () =>
        //    {

        //        var user = await userManager.FindByEmailAsync(model.Eposta);
        //        if (user == null)
        //        {
        //            return NotFound("Kullanıcı yok!");
        //        }
        //        var result = await userManager.ResetPasswordAsync(user, model.Kod, model.Sifre);
        //        if (result.Succeeded)
        //        {
        //            return Ok();
        //        }
        //        AddErrors(result);
        //        return BadRequest(ModelState);
        //    });
        //}



        [AllowAnonymous]
        [Route("kullaniciadikullanimda")]
        [HttpGet()]
        public async Task<IActionResult> KullaniciAdiKullaniliyormu([FromQuery]string kullaniciAdi)
        {
            return await HataKontrolluDondur<IActionResult>(async () =>
            {
                if (string.IsNullOrEmpty(kullaniciAdi.Trim()))
                    return BadRequest("Kullanıcı adı boş olamaz!");
                var kullaniciVar = await userManager.KullaniciAdiAlinmisAsync(kullaniciAdi); ;

                return Ok(kullaniciVar);
            });
        }
        [AllowAnonymous]
        [Route("epostakullanimda")]
        [HttpGet()]
        public async Task<IActionResult> EpostaKullaniliyormu([FromQuery]string eposta)
        {
            return await HataKontrolluDondur<IActionResult>(async () =>
            {
                if (string.IsNullOrEmpty(eposta.Trim()))
                    return BadRequest("Kullanıcı adı boş olamaz!");
                var epostaVar = await userManager.EpostaKullaniliyorAsync(eposta);

                return Ok(epostaVar);
            });
        }

        [AllowAnonymous]
        [Route("telefonnumarasikullanimda")]
        [HttpGet()]
        public async Task<IActionResult> TelefonNumarasiKullanimda([FromQuery]string telefonno)
        {
            return await HataKontrolluDondur<IActionResult>(async () =>
            {
                if (string.IsNullOrEmpty(telefonno.Trim()))
                    return BadRequest("Kullanıcı adı boş olamaz!");
                var epostaVar = await userManager.TelefonKullaniliyorAsync(telefonno);

                return Ok(epostaVar);
            });
        }

        #region Helpers

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }
        }
        #endregion


    }
}