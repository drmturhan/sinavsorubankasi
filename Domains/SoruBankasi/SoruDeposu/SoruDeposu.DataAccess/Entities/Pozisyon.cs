using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Entities
{
    public class Pozisyon
    {
        public int PozisyonId { get; set; }
        public string PozisyonAdi { get; set; }
        public string PozisyonKodu { get; set; }
        public string Kisaltmasi { get; set; }
        public bool Akademik { get; set; }
        public bool Idari { get; set; }
        public int IdariGuc { get; set; }
        public int AkademikGuc { get; set; }
        public ICollection<PozisyonGrup> GrupTanimlari { get; set; } = new List<PozisyonGrup>();
        public ICollection<BirimPersonel> BirimPersonelListesi { get; set; } = new List<BirimPersonel>();
        public ICollection<BirimGrup> AkademikYonettigiBirimGruplari { get; set; } = new List<BirimGrup>();
        public ICollection<BirimGrup> IdariYonettigiBirimGruplari { get; set; } = new List<BirimGrup>();

    }
}
