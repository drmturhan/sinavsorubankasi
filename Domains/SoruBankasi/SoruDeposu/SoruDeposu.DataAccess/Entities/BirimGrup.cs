using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Entities
{
    public class BirimGrup
    {
        public int BirimGrupId { get; set; }
        public int? UstBirimGrupNo { get; set; }
        public BirimGrup UstGrubu { get; set; }
        public string BirimGrupAdi { get; set; }
        public int? IdariAmirPozisyonNo { get; set; }
        public Pozisyon IdariAmirPozisyonu { get; set; }
        public int? AkademikAmirPozisyonNo { get; set; }
        public Pozisyon AkademikAmirPozisyonu { get; set; }
        public int? IdariGuc { get; set; }
        public int? AkademikGuc { get; set; }
        public int? Akademik { get; set; }
        public int? Idari { get; set; }
        public ICollection<Birim> Birimleri { get; set; } = new List<Birim>();
        public ICollection<BirimGrup> AltBirimleri { get; set; } = new List<BirimGrup>();

    }
}
