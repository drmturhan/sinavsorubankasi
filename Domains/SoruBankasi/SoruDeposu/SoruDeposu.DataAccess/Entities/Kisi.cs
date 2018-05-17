using System;
using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Entities
{
    public class Kisi
    {
        public int KisiId { get; set; }
        public string Unvan { get; set; }
        public string Ad { get; set; }
        public string Soyad { get; set; }
        public string DigerAd { get; set; }
        public DateTime DogumTarihi { get; set; }
        public int CinsiyetNo { get; set; }
        public Cinsiyet Cinsiyeti { get; set; }
        public int? MedeniHalNo { get; set; }
        public MedeniHal MedeniHali { get; set; }
        public ICollection<Personel> Personellikleri { get; set; } = new List<Personel>();
    }
}
