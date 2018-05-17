using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Entities
{
    public class SoruZorluk
    {
        public int ZorlukId { get; set; }
        public string ZorlukAdi { get; set; }
        public ICollection<Soru> Sorulari { get; set; } = new List<Soru>();

    }
}
