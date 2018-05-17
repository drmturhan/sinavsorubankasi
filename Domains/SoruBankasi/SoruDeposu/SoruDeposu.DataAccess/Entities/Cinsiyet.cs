using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Entities
{
    public class Cinsiyet
    {
        public int CinsiyetId { get; set; }
        public string CinsiyetAdi { get; set; }
        public ICollection<Kisi> Kisiler { get; set; } = new List<Kisi>();

    }
}
