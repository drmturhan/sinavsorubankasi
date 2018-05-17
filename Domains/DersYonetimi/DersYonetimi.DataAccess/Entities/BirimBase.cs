namespace DersYonetimi.DataAccess.Entities
{
    // 

    public class BirimBase
    {
        public int BirimId { get; set; }
        public int UniversiteNo { get; set; }
        public int BirimGrupNo { get; set; }
        public int? BagliBirimNo { get; set; }
        public string BirimAdi { get; set; }
        public int? AkademikAmirPersonelNo { get; set; }
        public int? IdariAmirPersonelNo { get; set; }
        
        
    }
}
