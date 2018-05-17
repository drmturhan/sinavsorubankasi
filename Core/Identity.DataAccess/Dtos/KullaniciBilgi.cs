namespace Identity.DataAccess.Dtos
{
    public class KullaniciBilgi
    {
        public int Id { get; set; }
        public string TamAdi { get; set; }
        public string KullaniciAdi { get; set; }
        public string Eposta { get; set; }
        public bool EpostaOnaylandi { get; set; }
        public string TelefonNumarasi { get; set; }
        public bool TelefonOnaylandi { get; set; }
        public string ProfilFotoUrl { get; set; }
        public int Yasi { get; set; }
        public string CinsiyetNo { get; set; }
        public int? KisiNo { get; set; }
        public int? PersonelNo { get; set; }
        public bool Yonetici { get; set; }
        public int? GecerlilikOmruDakika { get; set; }

    }
}

