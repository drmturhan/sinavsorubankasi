namespace DersYonetimi.DataAccess.Entities
{
    public class DersKonuCekirdekHastalikBase
    {

        public int DersKonuCekirdekHastalikId { get; set; }
        public int DersNo { get; set; }
        public int? KonuNo { get; set; }
        public int SemptomDurumNo { get; set; }
        public int CekirdekHastalikNo { get; set; }
        public string OgrenmeDuzeyleri { get; set; }
        public int OrganSistemNo { get; set; }


    }
}
