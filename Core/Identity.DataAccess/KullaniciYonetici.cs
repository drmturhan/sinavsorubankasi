using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Identity.DataAccess
{

    public class KullaniciYonetici : UserManager<Kullanici>, ICinsiyetSecimListesiSaglar
    {

        public KullaniciYonetici(IKullaniciStore<Kullanici> store, IOptions<IdentityOptions> optionsAccessor, IPasswordHasher<Kullanici> passwordHasher, IEnumerable<IUserValidator<Kullanici>> userValidators, IEnumerable<IPasswordValidator<Kullanici>> passwordValidators, Microsoft.AspNetCore.Identity.ILookupNormalizer keyNormalizer, IdentityErrorDescriber errors, IServiceProvider services, ILogger<UserManager<Kullanici>> logger) : base(store, optionsAccessor, passwordHasher, userValidators, passwordValidators, keyNormalizer, errors, services, logger)
        {
        }

        IKullaniciStore<Kullanici> Depo { get { return Store as IKullaniciStore<Kullanici>; } }
        public override Task<IdentityResult> CreateAsync(Kullanici user)
        {
            KullaniciKisi kisi = kisi = Depo.KisiyiAl(user.Kisi.Ad, user.Kisi.Soyad, user.Kisi.DogumTarihi, user.Kisi.CinsiyetNo);

            if (kisi != null && Depo.KisininKullanicisiVar(kisi))
            {

                IdentityResult sonuc = new IdentityResult();
                (sonuc.Errors as List<IdentityError>).AddRange(new List<IdentityError>{
                new IdentityError
              {
                Code = "Kullanıcı Var!",
                Description = $"{kisi.Ad} {kisi.Soyad} ({DateTime.Now.Year - kisi.DogumTarihi.Year} yaş) adında kullanıcı zaten var."
              },
                new IdentityError

                {
                  Code = "Birden fazla kullanıcı olamaz",
                  Description = "Aynı kişinin birden fazla kullanıcısı olamaz!"
                } ,
                new IdentityError

                {
                  Code = "Eksternal Login",
                  Description = "Google, Microsoft vb. ile bağlanıyorsanız kullanıcınız var ise kullanıcı panelinden hesabınızı bağlayın lütfen.!"
                } });
                return Task.FromResult<IdentityResult>(sonuc);
            }
            user.YaratilmaTarihi = DateTime.Now;
            user.Yonetici = false;
            user.Pasif = true;
            return base.CreateAsync(user);
        }

        public async Task<Boolean> KullaniciGuvenlikKoduDogrumu(string kod)
        {
            return await Depo.KullaniciGetirGuvenlikKodunaGore(kod);
        }

        public Task<List<Kullanici>> ListeGetirEpostayaBenzer(string eposta)
        {
            return Depo.ListeGetirEpostayaBenzerAsync(eposta);
        }

        public Task<List<Kullanici>> TumKullanicileriAl()
        {
            return Depo.ListeGetirKullanicilarinTumuAsync();
        }

        public async Task<Kullanici> KullaniciyiGetirEpostayaGore(string eposta)
        {
            return await Depo.KullaniciyiGetirEpostayaGoreAsync(eposta);
        }


        public KullaniciKisi KisiBul(int kisiNo)
        {
            return Depo.KisiyiAl(kisiNo);
        }

        public async Task<bool> KisiyiKaydetAsync(KullaniciKisi kisi, string hataMesaji)
        {
            return await Depo.KisiyiKaydetAsync(kisi, hataMesaji);
        }

        List<KeyValuePair<string, string>> ICinsiyetSecimListesiSaglar.TumCinsiyetleriAl()
        {
            var liste = Depo.ListeGetirCinsiyetlerAsync().Result
             .Select(cinsiyet => new KeyValuePair<string, string>(cinsiyet.CinsiyetId.ToString(), cinsiyet.CinsiyetAdi)).ToList();
            return liste;
        }
        public override Task<Kullanici> FindByIdAsync(string userId)
        {
            return Depo.KullaniciyiGetirIdyeGoreAsync(userId);
        }
        public async Task<Kullanici> KullaniciyiGetirKullaniciAdinaGoreAsync(string userName)
        {
            return await Depo.KullaniciyiGetirKullaniciAdinaGoreAsync(userName);
        }
        public async Task<bool> KullaniciAdiAlinmisAsync(string userName)
        {
            return await Depo.KullaniciAdiKullaniliyorAsync(userName);
        }
        public Task<bool> EpostaKullaniliyorAsync(string eposta)
        {
            return Depo.EpostaKullaniliyorAsync(eposta);
        }
        public Task<bool> TelefonKullaniliyorAsync(string telefonNumarasi)
        {
            return Depo.TelefonNumarasiKullaniliyorAsync(telefonNumarasi);
        }
        public async Task<KisiFoto> FotoBulAsync(int id)
        {
            return await Depo.FotoBulAsync(id);
        }
        public override async Task<IdentityResult> ConfirmEmailAsync(Kullanici user, string token)
        {

            var sonuc = await base.ConfirmEmailAsync(user, token);
            if (sonuc.Succeeded)
            {
                user.Pasif = false;
                user.SecurityStamp = Guid.NewGuid().ToString();
                return await UpdateAsync(user);
            }
            return sonuc;
        }

        public async Task<int> PersonelNumarasiniAlAsync(int kullaniciNo) {

            var sonuc = await Depo.PersonelNumarasiniAlAsync(kullaniciNo);
            return sonuc;
           
        }
      
        
    }
}
