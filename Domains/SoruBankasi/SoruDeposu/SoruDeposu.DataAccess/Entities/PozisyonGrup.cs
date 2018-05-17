namespace SoruDeposu.DataAccess.Entities
{
    public class PozisyonGrup
    {
        public int PozisyonNo { get; set; }
        public Pozisyon Pozisyonu { get; set; }
        public int PozisyonGrupTanimNo { get; set; }
        public PozisyonGrupTanim PozisyonGrupTanimi { get; set; }

    }
}
