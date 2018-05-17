using System;
using System.Collections.Generic;

namespace Psg.Api.Models
{
    public class Hasta
    {
        public int Id { get; set; }
        public string Ad { get; set; }
        public string Soyad { get; set; }
        public DateTime DogumTarihi { get; set; }
        public ICollection<UykuTest> UykuTestleri { get; set; }
    }
}