using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Entities
{
    public class Personel
    {
        public int PersonelId { get; set; }
        public int KisiNo { get; set; }
        public Kisi KisiBilgisi { get; set; }
        public ICollection<Universite> AkademikYonettigiUniversiteler { get; set; } = new List<Universite>();
        public ICollection<Universite> IdariYonettigiUniversiteler { get; set; } = new List<Universite>();

        public ICollection<Birim> AkademikYonettigiBirimler { get; set; } = new List<Birim>();
        public ICollection<Birim> IdariYonettigiBirimler { get; set; } = new List<Birim>();
        public ICollection<BirimPersonel> CalistigiBirimler { get; set; } = new List<BirimPersonel>();
        public ICollection<DersHoca> Anlattiklari{ get; set; } = new List<DersHoca>();
        public ICollection<SoruKontrol> SoruKontrolleri { get; set; } = new List<SoruKontrol>();

    }
}
