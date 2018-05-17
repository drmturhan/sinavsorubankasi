using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace Identity.DataAccess.Dtos
{


    public class FotografYazDto
    {
        public string Url { get; set; }
        public IFormFile File { get; set; }
        public string Aciklama { get; set; }
        public DateTime EklenmeTarihi { get; set; }
        public string PublicId { get; set; }
        public bool ProfilFotografi { get; set; }

        public FotografYazDto()
        {
            EklenmeTarihi = DateTime.Now;
        }
    }
}

