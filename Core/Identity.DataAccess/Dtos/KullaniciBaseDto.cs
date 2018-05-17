using System;
using System.Collections.Generic;

namespace Identity.DataAccess.Dtos
{
    public class KullaniciBaseDto
    {
        public int Id { get; set; }
        public string KullaniciAdi { get; set; }
        public string Eposta { get; set; }
        public bool EpostaOnaylandi { get; set; }
        public string TelefonNumarasi { get; set; }
        public bool TelefonOnaylandi { get; set; }
        public string ProfilFotoUrl { get; set; }
        public string CinsiyetAdi { get; set; }
        public bool Pasif { get; set; }
        public int Yasi { get; set; }
        public DateTime YaratilmaTarihi { get; set; }
        public DateTime? SonAktifOlma { get; set; }
        public ICollection<FotoDetayDto> Fotograflari { get; set; } = new List<FotoDetayDto>();
        public string TamAdi { get; set; }
    }
    
}

