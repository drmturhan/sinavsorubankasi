namespace SoruDeposu.DataAccess.Entities
{
    public class SoruHedefBag
    {
        public int? SoruNo { get; set; }
        public Soru Sorusu { get; set; }
        public int? OgrenimHedefNo { get; set; }
        public OgrenimHedef Hedefi { get; set; }
    }
}
