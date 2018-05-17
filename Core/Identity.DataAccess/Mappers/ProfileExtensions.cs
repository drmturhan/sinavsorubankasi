using Core.EntityFramework.SharedEntity;
using System.Linq;

namespace Identity.DataAccess.Mappers
{
    public static class ProfileExtensions
    {
        public static string AsilFotografUrlGetir(this Kullanici entity)
        {
            if (entity == null || entity.Kisi != null && entity.Kisi.Fotograflari.Count == 0) return string.Empty;
            Foto asilFoto = entity.Kisi.Fotograflari.FirstOrDefault(f => f.ProfilFotografi);
            return asilFoto != null ? asilFoto.Url : string.Empty;
        }
        public static string TamAdOlustur(this Kullanici entity)
        {
            if (entity.Kisi == null) return entity.UserName;
            string donecek = $"{entity.Kisi.Unvan.TrimEnd()} {entity.Kisi.Ad.TrimEnd()}";
            if (!string.IsNullOrWhiteSpace(entity.Kisi.DigerAd))
                donecek = donecek + $" {entity.Kisi.DigerAd.TrimEnd()}";
            donecek = donecek + $" {entity.Kisi.Soyad.TrimEnd()}";
            return donecek.TrimEnd();


        }
    }
}
