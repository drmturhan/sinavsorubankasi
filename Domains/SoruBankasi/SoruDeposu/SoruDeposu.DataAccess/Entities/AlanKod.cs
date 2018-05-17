using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Entities
{
    public class AlanKod
    {

        public int AlanKodId { get; set; }
        public string AlanKodAdi { get; set; }
        public ICollection<Ders> Dersleri { get; set; } = new List<Ders>();
    }
}
