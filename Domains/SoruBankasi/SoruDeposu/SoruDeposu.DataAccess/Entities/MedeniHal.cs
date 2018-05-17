using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Entities
{
    public class MedeniHal
    {
        public int MedeniHalId { get; set; }
        public string MedeniHalAdi { get; set; }
        public ICollection<Kisi> Kisiler { get; set; } = new List<Kisi>();

    }
}
