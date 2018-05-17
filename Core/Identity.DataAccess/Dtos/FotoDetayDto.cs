using System;

namespace Identity.DataAccess.Dtos
{
    public class FotoDetayDto
    {
        public int Id { get; set; }
        public int KisiNo { get; set; }
        public string Url { get; set; }
        public string Aciklama { get; set; }
        public DateTime EklenmeTarihi { get; set; }
        public bool ProfilFotografi { get; set; }

    }
}

