namespace SoruDeposu.DataAccess.Entities
{
    public class TekDogruluSoruSecenek
    {
        public int? TekDogruluSoruSecenekId { get; set; }
        public int SoruNo { get; set; }
        public Soru Sorusu { get; set; }
        public string SecenekMetni { get; set; }
        public bool DogruSecenek { get; set; }
        public bool? hemenElenebilir { get; set; }

    }
}
