using System;

namespace Core.EntityFramework.SharedEntity
{
    public class ArkadaslikTeklifBase 
    {
        public int TeklifEdenNo { get; set; }
        public int TeklifEdilenNo { get; set; }
        public DateTime IstekTarihi { get; set; }
        public DateTime? CevapTarihi { get; set; }
        public bool? Karar { get; set; }
        public DateTime? IptalTarihi { get; set; }
        public int? IptalEdenKullaniciNo { get; set; }
        public bool? IptalEdildi { get; set; }
    }
}
