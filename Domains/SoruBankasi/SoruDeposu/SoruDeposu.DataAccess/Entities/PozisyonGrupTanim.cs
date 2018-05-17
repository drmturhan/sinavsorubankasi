using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Entities
{
    public class PozisyonGrupTanim
    {
        public int PozisyonGrupTanimId { get; set; }
        public string PozisyonGrupTanimAdi { get; set; }
        public string PozisyonGrupTanimKisaAdi { get; set; }
        public ICollection<PozisyonGrup> Pozisyonlari { get; set; } = new List<PozisyonGrup>();
    }
}
