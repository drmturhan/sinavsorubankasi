namespace DersYonetimi.DataAccess.Entities
{
    public class BirimGrupBase
    {
        public int BirimGrupId { get; set; }
        public int? UstBirimGrupNo { get; set; }
        public string BirimGrupAdi { get; set; }
        public int? IdariAmirPozisyonNo { get; set; }
        public int? AkademikAmirPozisyonNo { get; set; }
        public int? IdariGuc { get; set; }
        public int? AkademikGuc { get; set; }
        public int? Akademik { get; set; }
        public int? Idari { get; set; }
        
    }
}
