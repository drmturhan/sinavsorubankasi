using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Identity.DataAccess
{
    public class KullaniciStore : UserStore<Kullanici, Rol, MTIdentityDbContext, int>, IKullaniciStore<Kullanici>
    {
        public KullaniciStore(MTIdentityDbContext context, IdentityErrorDescriber describer = null) : base(context, describer)
        {
        }
        public bool KisininKullanicisiVar(KullaniciKisi kisi)
        {
            return Context.Users.Any(k => k.KisiNo == kisi.KisiId);
        }

        public KullaniciKisi KisiyiAl(string ad, string soyad, DateTime dogumTarihi, int? cinsiyetId)
        {
            var query = Context.Kisiler.Where(k => k.Ad == ad && k.Soyad == soyad && k.DogumTarihi == dogumTarihi).AsQueryable<KullaniciKisi>();
            if (cinsiyetId.HasValue)
                query = query.Where(k => k.CinsiyetNo == cinsiyetId.Value);

            return query.SingleOrDefault();
        }

        public KullaniciKisi KisiyiAl(int kisiNo)
        {
            return Context.Find<KullaniciKisi>(kisiNo);
        }

        public async Task<bool> KisiyiKaydetAsync(KullaniciKisi bulunanKisi, string hataMesaji)
        {

            try
            {
                if (string.IsNullOrEmpty(hataMesaji))
                    hataMesaji = "Kişi kaydedilemedi.";
                var degisen = Context.Attach(bulunanKisi);
                degisen.State = EntityState.Modified;
                int sonuc = await Context.SaveChangesAsync();
                if (sonuc <= 0)
                    hataMesaji += "Değişiklikler kaydedilirken bir hata oluştu!";
                else
                    hataMesaji = string.Empty;
                return true;
            }
            catch (Exception hata)
            {
                hataMesaji = hata.Message;
                return false;
            }
        }

        public async Task<Kullanici> KullaniciyiGetirEpostayaGoreAsync(string eposta)
        {
            return await Context.Users.Include(k => k.Kisi).ThenInclude(kisi => kisi.Cinsiyeti).SingleOrDefaultAsync(k => k.Email == eposta);
        }

        public async Task<Kullanici> KullaniciyiGetirIdyeGoreAsync(string id)
        {
            int kullaniciNo;
            int.TryParse(id, out kullaniciNo);
            if (kullaniciNo <= 0) return null;
            return await Context.Users.Include(kul => kul.Kisi).ThenInclude(k => k.Cinsiyeti)
                .Include(kul => kul.Kisi).ThenInclude(k => k.MedeniHali).SingleOrDefaultAsync(k => k.Id == kullaniciNo);
        }
        public async override Task<Kullanici> FindByIdAsync(string userId, CancellationToken cancellationToken = default(CancellationToken))
        {
            int kullaniciNo;
            int.TryParse(userId, out kullaniciNo);
            if (kullaniciNo <= 0) return null;
            return await Context.Users.Include(kul => kul.Kisi).ThenInclude(k => k.Cinsiyeti)
                .Include(kul => kul.Kisi).ThenInclude(k => k.MedeniHali).SingleOrDefaultAsync(k => k.Id == kullaniciNo, cancellationToken);
        }

        public async Task<List<KisiCinsiyet>> ListeGetirCinsiyetlerAsync()
        {
            return await Context.Cinsiyetler.OrderBy(c => c.CinsiyetAdi).ToListAsync();

        }

        public async Task<List<Kullanici>> ListeGetirEpostayaBenzerAsync(string eposta)
        {
            return await Context.Users.Include(k => k.Kisi).Where(k => k.Email.Contains(eposta)).ToListAsync();
        }

        public async Task<List<Kullanici>> ListeGetirKullanicilarinTumuAsync()
        {
            return await Context.Users.Include(k => k.Kisi).ToListAsync();
        }

        public async Task<KisiFoto> FotoBulAsync(int fotoNo)
        {
            return await Context.KisiFotograflari.SingleOrDefaultAsync(s => s.FotoId == fotoNo);
        }

        public async Task<bool> KullaniciGetirGuvenlikKodunaGore(string kod)
        {
            var kullanici = await Context.Users.SingleOrDefaultAsync(k => k.SecurityStamp == kod && k.EmailConfirmed);
            if (kullanici == null) return false;
            //kullanici.Pasif = false;
            //kullanici.SecurityStamp = Guid.NewGuid().ToString();
            //await Context.SaveChangesAsync();
            return true;
        }

        public async Task<Kullanici> KullaniciyiGetirKullaniciAdinaGoreAsync(string userName)
        {
            Kullanici kullanici = null;
            try
            {
                kullanici = await Context.Users
                    .Include(kul => kul.Kisi).ThenInclude(k => k.Cinsiyeti)
                    .Include(kul => kul.Kisi).ThenInclude(k => k.Personellikleri)
                    .Include(kul => kul.Kisi).ThenInclude(k => k.Fotograflari).
                    SingleOrDefaultAsync(k => k.UserName == userName);

            }
            catch (Exception hata)
            {

            }
            return kullanici;

        }



        public async Task<bool> KullaniciAdiKullaniliyorAsync(string userName)
        {
            return await Context.Users.AnyAsync(k => k.NormalizedUserName == userName.ToUpperInvariant());
        }

        public async Task<bool> EpostaKullaniliyorAsync(string eposta)
        {
            return await Context.Users.AnyAsync(k => k.NormalizedEmail == eposta.ToUpperInvariant());
        }

        public async Task<bool> TelefonNumarasiKullaniliyorAsync(string telefonNumarasi)
        {
            return await Context.Users.AnyAsync(k => k.PhoneNumber == telefonNumarasi);
        }

        public async Task<int> PersonelNumarasiniAlAsync(int kullaniciNo)
        {
            var sonuc = await Context.Users.Where(u => u.Id == kullaniciNo && u.Kisi.Personellikleri.Any()).Select(u => u.Kisi.Personellikleri.FirstOrDefault().PersonelId).ToListAsync();
            return sonuc.FirstOrDefault();
        }
    }
}

