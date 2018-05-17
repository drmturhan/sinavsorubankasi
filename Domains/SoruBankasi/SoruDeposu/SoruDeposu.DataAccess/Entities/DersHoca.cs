namespace SoruDeposu.DataAccess.Entities
{
    public class DersHoca
    {

        public int DersHocaId { get; set; }
        public int? DersNo { get; set; }
        public Ders Dersi { get; set; }
        public int? KonuNo { get; set; }
        public Konu Konusu { get; set; }
        public int? PersonelNo { get; set; }
        public Personel PersonelBilgisi { get; set; }
        public int KuramsalSaati { get; set; }
        public int UygualamaSaati { get; set; }
    }
}
