using System;
using System.Collections.Generic;

namespace Identity.DataAccess.Dtos
{

    public class ProfilOku : KullaniciBaseDto
    {
        public int KisiNo { get; set; }
        public string Unvan { get; set; }
        public string Ad { get; set; }
        public string Soyad { get; set; }
        public string DigerAd { get; set; }
        public int CinsiyetNo { get; set; }
        public DateTime DogumTarihi { get; set; }
    }

    public class ProfilYazDto 
    {
        public int Id { get; set; }
        public string KullaniciAdi { get; set; }
        public string TamAdi { get; set; }
        public int KisiNo { get; set; }
        public string Unvan { get; set; }
        public string Ad { get; set; }
        public string Soyad { get; set; }
        public string DigerAd { get; set; }
        public int CinsiyetNo { get; set; }
        public DateTime DogumTarihi { get; set; }

    }
}

