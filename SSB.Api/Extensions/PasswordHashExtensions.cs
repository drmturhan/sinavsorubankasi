using System.Text;

namespace Psg.Api.Extensions
{

    public static class PasswordHashExtensions
    {
        public static void CreateHashes(this string sifre, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(sifre));
            }
        }

        public static void VerifyPasswordHash(this string sifre, byte[] passwordHash, byte[] passswordSalt, out bool sonuc)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passswordSalt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(sifre));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != passwordHash[i]) sonuc = false;
                }
            }
            sonuc = true;
        }
    }

}
