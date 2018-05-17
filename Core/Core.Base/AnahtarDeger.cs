using System.Collections.Generic;

namespace Core.Base
{
    public class AnahtarDeger
    {
        public AnahtarDeger()
        {
            Liste = new List<AnahtarDeger>();
        }
        public int Anahtar { get; set; }
        public string Deger { get; set; }
        public IList<AnahtarDeger> Liste { get; protected set; }
        public string ListeAdi { get; set; }
    }
}
