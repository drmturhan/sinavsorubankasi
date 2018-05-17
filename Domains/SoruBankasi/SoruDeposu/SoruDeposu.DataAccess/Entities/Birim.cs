using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Entities
{
    public class Birim
    {
        public int BirimId { get; set; }
        public int UniversiteNo { get; set; }
        public Universite Universitesi { get; set; }
        public int BirimGrupNo { get; set; }
        public BirimGrup Grubu { get; set; }
        public int? BagliBirimNo { get; set; }
        public Birim UstBirim { get; set; }
        public string BirimAdi { get; set; }
        public int? AkademikAmirPersonelNo { get; set; }
        public Personel AkademikAmir { get; set; }
        public int? IdariAmirPersonelNo { get; set; }
        public Personel IdariAmir { get; set; }
        public ICollection<Program> Programlari { get; set; } = new List<Program>();
        public ICollection<Birim> AltBirimleri { get; set; } = new List<Birim>();
        public ICollection<BirimPersonel> Personelleri { get; set; } = new List<BirimPersonel>();

    }
}
