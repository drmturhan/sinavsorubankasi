using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Entities
{
    public class Donem
    {
        public int DonemId { get; set; }
        public int ProgramNo { get; set; }
        public Program Programi { get; set; }
        public int DonemNumarasi { get; set; }
        public string DonemAdi { get; set; }
        public int Sinifi { get; set; }
        public int Aktif { get; set; }
        public ICollection<DersGrup> DersGruplari { get; set; } = new List<DersGrup>();
        

    }
}
