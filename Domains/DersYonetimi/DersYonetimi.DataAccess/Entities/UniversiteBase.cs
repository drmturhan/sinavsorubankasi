namespace DersYonetimi.DataAccess.Entities
{
    public class UniversiteBase
    {
        public int UniversiteId { get; set; }
        public string UniversiteAdi { get; set; }
        public int? IdariAmirPozisyonNo { get; set; }
        public int? AkademikAmirPozisyonNo { get; set; }
        public int? IdariAmirPersonelNo { get; set; }
        public int? AkademikAmirPersonelNo { get; set; }

    }
}
