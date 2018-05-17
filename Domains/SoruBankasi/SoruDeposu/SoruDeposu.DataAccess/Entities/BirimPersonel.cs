using System;

namespace SoruDeposu.DataAccess.Entities
{
    public class BirimPersonel
    {
        public int BirimPersonelId { get; set; }
        public int BirimNo { get; set; }
        public Birim Birimi { get; set; }
        public int? PersonelNo { get; set; }
        public Personel PersonelBilgisi { get; set; }
        public int? PozisyonNo { get; set; }
        public Pozisyon Pozsiyonu { get; set; }
        public DateTime Baslangic { get; set; }
        public DateTime? Bitis { get; set; }


    }
}
