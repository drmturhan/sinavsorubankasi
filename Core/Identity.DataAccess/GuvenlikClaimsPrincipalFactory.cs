using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Identity.DataAccess
{
    public class MTClaimsPrincipalFactory : UserClaimsPrincipalFactory<Kullanici, Rol>
    {
        public MTClaimsPrincipalFactory(KullaniciYonetici userManager, RolYonetici roleManager, IOptions<IdentityOptions> optionsAccessor) : base(userManager, roleManager, optionsAccessor)
        {

        }
        public override async Task<ClaimsPrincipal> CreateAsync(Kullanici user)
        {
            var cp = await base.CreateAsync(user);
            var identity = cp.Identities.First();
            //if (user.KisiNo > 0 && user.Kisi != null)
            //    identity.AddClaim(new Claim("dogum_tarihi", user.Kisi.DogumTarihi.Value.ToString("dd.MM.yyyy")));
            return cp;
        }
    }



}
