using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Entities
{
    public class SoruKoku
    {

        public int SoruKokuId { get; set; }
        public string SoruKokuMetni { get; set; }
        public ICollection<Soru> Sorulari { get; set; } = new List<Soru>();
        
    }


}
