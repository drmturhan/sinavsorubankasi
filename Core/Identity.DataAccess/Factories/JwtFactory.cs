

using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using Core.EntityFramework.Factories;
using Identity.DataAccess.Dtos;
using Identity.DataAccess.Helpers;
using Microsoft.Extensions.Options;


namespace Identity.DataAccess.Helpers.Factories
{

    public class JwtFactory : IJwtFactory
    {
        private readonly JwtIssuerOptions _jwtOptions;

        public JwtFactory(IOptions<JwtIssuerOptions> jwtOptions)
        {
            _jwtOptions = jwtOptions.Value;
            ThrowIfInvalidOptions(_jwtOptions);
        }

        public async Task<string> GenerateEncodedToken(string userName, ClaimsIdentity identity)
        {


            var claims = new List<Claim>()
            {
                new Claim(JwtRegisteredClaimNames.Sub, userName),
                 new Claim(JwtRegisteredClaimNames.Jti, await _jwtOptions.JtiGenerator()),
                 new Claim(JwtRegisteredClaimNames.Iat, ToUnixEpochDate(_jwtOptions.IssuedAt).ToString(), ClaimValueTypes.Integer64),
                 
            };
            foreach (var item in identity.Claims)
            {
                claims.Add(item);
            }

            // Create the JWT security token and encode it.
            var jwt = new JwtSecurityToken(
                issuer: _jwtOptions.Issuer,
                audience: _jwtOptions.Audience,
                claims: claims,
                notBefore: _jwtOptions.NotBefore,
                expires: _jwtOptions.Expiration,
                signingCredentials: _jwtOptions.SigningCredentials);

            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            return encodedJwt;



        }


        public ClaimsIdentity GenerateClaimsIdentity(object gelenNesne)

        {
            if (!(gelenNesne is Kullanici)) throw new Exception("Kullanıcı nesnesi yok!");
            Kullanici kullanici = gelenNesne as Kullanici;


            var claims = new List<Claim> {
                new Claim("id", kullanici.Id.ToString()),
                new Claim(ClaimTypes.NameIdentifier,kullanici.Id.ToString()),
                new Claim(ClaimTypes.GivenName,kullanici.Kisi.Ad),
                new Claim(ClaimTypes.Surname,kullanici.Kisi.Soyad),
                new Claim(ClaimTypes.DateOfBirth,kullanici.Kisi.DogumTarihi.ToShortDateString()),
                new Claim(ClaimTypes.Email,kullanici.Email),
                new Claim(ClaimTypes.Gender,kullanici.Kisi.Cinsiyeti.CinsiyetAdi),
                new Claim("kisiNo",kullanici.KisiNo.ToString()),
                new Claim(ClaimTypes.Role, "api_access")
                };
            if (kullanici.Yonetici)
                claims.Add(new Claim(ClaimTypes.Role, "Yonetici")); ;

            return new ClaimsIdentity(new GenericIdentity(kullanici.UserName, "Token"), claims);

        }

        /// <returns>Date converted to seconds since Unix epoch (Jan 1, 1970, midnight UTC).</returns>
        private static long ToUnixEpochDate(DateTime date)
          => (long)Math.Round((date.ToUniversalTime() -
                               new DateTimeOffset(1970, 1, 1, 0, 0, 0, TimeSpan.Zero))
                              .TotalSeconds);

        private static void ThrowIfInvalidOptions(JwtIssuerOptions options)
        {
            if (options == null) throw new ArgumentNullException(nameof(options));

            if (options.ValidFor <= TimeSpan.Zero)
            {
                throw new ArgumentException("Must be a non-zero TimeSpan.", nameof(JwtIssuerOptions.ValidFor));
            }

            if (options.SigningCredentials == null)
            {
                throw new ArgumentNullException(nameof(JwtIssuerOptions.SigningCredentials));
            }

            if (options.JtiGenerator == null)
            {
                throw new ArgumentNullException(nameof(JwtIssuerOptions.JtiGenerator));
            }
        }
    }
}
