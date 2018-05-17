using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Identity.DataAccess
{
    public class Kullanici : IdentityUser<int>
    {
        public int? KisiNo { get; set; }
        public KullaniciKisi Kisi { get; set; }
        public bool Pasif { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime YaratilmaTarihi { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime? SonAktifOlmaTarihi { get; set; }
        [StringLength(250)]
        public bool Yonetici { get; set; }
        public long? FacebookId { get; set; }

        public ICollection<ArkadaslikTeklif> YapilanTeklifler { get; set; } = new List<ArkadaslikTeklif>();
        public ICollection<ArkadaslikTeklif> GelenTeklifler { get; set; } = new List<ArkadaslikTeklif>();
        public ICollection<Mesaj> GonderdigiMesajlar { get; set; } = new List<Mesaj>();
        public ICollection<Mesaj> AldigiMesajlar { get; set; } = new List<Mesaj>();

        [NotMapped]
        public string AdSoyad
        {
            get
            {
                return Kisi == null ? string.Empty : Kisi.UnvanAdSoyad;
            }
        }
    }

    
}
