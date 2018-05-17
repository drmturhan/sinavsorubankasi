using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Entities
{
    public class Mufredat
    {
        public int MufredatId { get; set; }
        public int Yil { get; set; }
        public ICollection<DersGrup> DersGruplari { get; set; } = new List<DersGrup>();
    }
}
