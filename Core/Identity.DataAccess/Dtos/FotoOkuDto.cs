using System;

namespace Identity.DataAccess.Dtos
{
    public class FotoOkuDto
    {
        public int Id { get; set; }
        public string DosyaAdi { get; set; }
        public string Url { get; set; }
        public string Aciklama { get; set; }
        public DateTime EklenmeTarihi { get; set; }
        public bool ProfilFotografi { get; set; }
        public string PublicId { get; set; }
    }
}

