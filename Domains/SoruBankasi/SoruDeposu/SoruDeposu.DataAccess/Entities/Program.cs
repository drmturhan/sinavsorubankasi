using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Entities
{
    public class Program
    {
        public int ProgramId { get; set; }
        public int BirimNo { get; set; }
        public Birim Birimi { get; set; }
        public string ProgramAdi { get; set; }
        public ICollection<Donem> Donemleri { get; set; } = new List<Donem>();
        
    }
}
