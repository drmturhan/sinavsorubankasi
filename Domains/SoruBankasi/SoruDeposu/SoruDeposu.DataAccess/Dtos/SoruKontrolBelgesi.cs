using System;
using System.Collections.Generic;
using System.Text;

namespace SoruDeposu.DataAccess.Dtos
{

    public class SoruKontrolBelgeDto {

        public int Sira { get; set; }
        public string GrupAdi { get; set; }
        public List<SoruKontrolItemDto> Kontroller { get; set; }
    }

    public class SoruKontrolItemDto
    {
        public string Cumle { get; set; }
        
        public int Sira { get; set; }
        public List<SoruKontrolItemDetayDto> Degerleri { get; set; } = new List<SoruKontrolItemDetayDto>();

    }
    public class SoruKontrolItemDetayDto
    {
        public string Deger { get; set; }
        public string Aciklama { get; set; }
        public int Puan { get; set; }
    }
}
