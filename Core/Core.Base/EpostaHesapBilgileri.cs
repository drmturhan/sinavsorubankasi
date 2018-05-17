namespace Core.Base
{
    public class EpostaHesapBilgileri
    {
        public string SaglayiciAdi { get; set; }
        public string Sunucu { get; set; }
        public string Sifre { get; set; }
        public string KullaniciAdi { get; set; }
        public bool SSLGerektirir { get; set; }
        public bool TLSGerektirir { get; set; }
        public bool KimlikDogrulamaGerektirir { get; set; }
        public int SSLBaglantiNoktasi { get; set; }
        public int TLSBaglantiNoktasi { get; set; }
         
    }
    public class SMSHesapBilgileri
    {
        public string KullaniciAdi { get; set; }
        public string Sifre { get; set; }
    }
}
