using Core.EntityFramework;
using System.Collections.Generic;

namespace SoruDeposu.DataAccess
{

    public class SoruSorgu : SorguBase
    {

        public int? BirimNo { get; set; }
        public int? ProgramNo { get; set; }
        public int? DonemNo { get; set; }
        public int? DersGrubuNo { get; set; }
        public int? DersNo { get; set; }
        public int? KonuNo { get; set; }
        public int? SoruTipNo { get; set; }
        public int? BilisselDuzeyNo { get; set; }
        public List<int> OgrenimCiktilar { get; set; }
        public SoruSorgu()
        {

        }
    }
}
