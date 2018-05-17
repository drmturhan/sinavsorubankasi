namespace DersYonetimi.DataAccess.Entities
{
    public class PozisyonBase
    {
        public int PozisyonId { get; set; }
        public string PozisyonAdi { get; set; }
        public string PozisyonKodu { get; set; }
        public string Kisaltmasi { get; set; }
        public bool Akademik { get; set; }
        public bool Idari { get; set; }
        public int IdariGuc { get; set; }
        public int AkademikGuc { get; set; }

    }
}
