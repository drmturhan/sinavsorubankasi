using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Psg.Api.Models
{

    
  
    public class UykuTest
    {
        public int Id { get; set; }
        public DateTime? Tarih { get; set; }
        public int HastaNo { get; set; }
        public Hasta Hasta { get; set; }
        public double Ahi { get; set; }
        public double St90 { get; set; }
    }

}
