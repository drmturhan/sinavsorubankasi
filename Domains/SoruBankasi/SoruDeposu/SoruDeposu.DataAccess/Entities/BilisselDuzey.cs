using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Entities
{
    public class BilisselDuzey
    {
        public int BilisselDuzeyId { get; set; }
        public string BilisselDuzyeAdi { get; set; }
        public bool? Aktif { get; set; }
        public ICollection<Soru> Sorulari { get; set; } = new List<Soru>();
    }

  
}
