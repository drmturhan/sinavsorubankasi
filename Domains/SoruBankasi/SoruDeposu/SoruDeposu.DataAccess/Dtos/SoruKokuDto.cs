using System;
using System.Collections.Generic;
using System.Text;

namespace SoruDeposu.DataAccess.Dtos
{
    public class SoruKokuListeDto
    {
        public int SoruKokuId { get; set; }
        public string SoruKokuMetni { get; set; }
        public int? DersNo { get; set; }
        public string DersAdi{ get; set; }
        public int? KonuNo { get; set; }
        public string KonuAdi { get; set; }
        public ICollection<SoruListeDto> Sorulari { get; set; } = new List<SoruListeDto>();


    }
    public class SoruKokuYaratDto
    {
        
        public string SoruKokuMetni { get; set; }
        public ICollection<SoruYaratDto> Sorulari { get; set; } = new List<SoruYaratDto>();
    }

    public class SoruKokuDegistirDto
    {
        public int SoruKokuId { get; set; }
        public string SoruKokuMetni { get; set; }
        public ICollection<SoruDegistirDto> Sorulari { get; set; } = new List<SoruDegistirDto>();
    }
}
