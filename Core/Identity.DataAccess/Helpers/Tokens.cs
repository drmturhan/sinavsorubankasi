using Core.EntityFramework.Factories;
using Identity.DataAccess.Dtos;
using Newtonsoft.Json;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Identity.DataAccess.Helpers
{
    public class Tokens
    {
        public static async Task<string> GenerateJwt(ClaimsIdentity identity, IJwtFactory jwtFactory, string userName, JwtIssuerOptions jwtOptions)
        {
            return await jwtFactory.GenerateEncodedToken(userName, identity);
        
        }

    }
}
