using Core.Base;
using Core.EntityFramework.SharedEntity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Identity.DataAccess
{
    public class KisiCinsiyet : Cinsiyet<int>
    {
        public ICollection<KullaniciKisi> Kisileri { get; set; } = new List<KullaniciKisi>();
    }
   
}
