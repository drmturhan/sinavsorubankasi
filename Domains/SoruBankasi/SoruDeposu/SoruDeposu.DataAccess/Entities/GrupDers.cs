namespace SoruDeposu.DataAccess.Entities
{
    public class GrupDers
    {
        public int DersGrupNo { get; set; }
        public DersGrup DersGrubu { get; set; }
        public int DersNo { get; set; }
        public Ders Dersi { get; set; }

    }
}
