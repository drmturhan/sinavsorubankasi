using Microsoft.AspNetCore.Identity;
using System.Linq;
using System.Threading.Tasks;

namespace Identity.DataAccess
{
    public class KullaniciAdSoyadOlamazPasswordValidator : IPasswordValidator<Kullanici>
    {
        private MTIdentityDbContext _db;

        public KullaniciAdSoyadOlamazPasswordValidator(MTIdentityDbContext context)
        {
            _db = context;
        }
        public Task<IdentityResult> ValidateAsync(
          UserManager<Kullanici> manager,
          Kullanici user,
          string password)
        {

            IdentityError hata = null;
            if (user.KisiNo > 0)
                user.Kisi = _db.Kisiler.SingleOrDefault(k => k.KisiId == user.KisiNo);
            if (user.Kisi == null)
                hata = new IdentityError { Code = "Kullanıcı girişi eksik", Description = "Kullanıcının kişi bilgisi eksik girilmiş. Bu şekilde şifre kurtaramazsınız. Lütfen site yöneticisine konu ile ilgili eposta gönderiniz!" };
            if (hata == null)
                return Task.FromResult(
                 password.Contains(user.Kisi.Ad) || password.Contains(user.Kisi.Soyad) ?
                IdentityResult.Failed(new IdentityError
                {
                    Code = "Şifrede kullanıcı adı veya soyadını içeremez.",
                    Description = "Güvenliğiniz için kullanıcı adınızı veya soyadınızı şifrenize yazmamalısınız!"
                }) :
                IdentityResult.Success);
            return
                Task.FromResult(IdentityResult.Failed(hata));
        }
    }



}
