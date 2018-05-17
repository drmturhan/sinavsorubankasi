using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Entities
{
    public class Universite
    {
        public int UniversiteId { get; set; }
        public string UniversiteAdi { get; set; }
        public int? IdariAmirPozisyonNo { get; set; }
        public int? AkademikAmirPozisyonNo { get; set; }
        public int? IdariAmirPersonelNo { get; set; }
        public Personel AkademikAmir { get; set; }
        public int? AkademikAmirPersonelNo { get; set; }
        public Personel IdariAmir { get; set; }
        public ICollection<Birim> Birimleri { get; set; } = new List<Birim>();
        

    }
}
