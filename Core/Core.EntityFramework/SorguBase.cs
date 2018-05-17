namespace Core.EntityFramework
{
    public abstract class SorguBase
    {
        public string AramaCumlesi { get; set; }
        public string Alanlar { get; set; }
        public string SiralamaCumlesi { get; set; }
        public int Sayfa { get; set; } = 1;
        public int SayfaBuyuklugu { get; set; } = 10;
       
    }
}
