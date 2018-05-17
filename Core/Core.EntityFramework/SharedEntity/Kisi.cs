using Core.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Core.EntityFramework.SharedEntity
{

    public class Kisi : Kisi<int>
    {

    }

    public class Kisi<TKey> : EBase, IEntity<TKey> where TKey : IEquatable<TKey>
    {
        public Kisi()
        {

        }
        public TKey KisiId { get; set; }
        public string Unvan { get; set; }
        public string Ad { get; set; }
        public string DigerAd { get; set; }
        public string Soyad { get; set; }

        public DateTime DogumTarihi { get; set; }
        public int? CinsiyetNo { get; set; }
        public int? MedeniHalNo { get; set; }

        [NotMapped]
        public TKey Kimlik { get { return KisiId; } set { KisiId = value; } }
        [NotMapped]
        public string UnvanAdSoyad { get { return $"{Unvan} {Ad} {Soyad}".Trim(); } }
    }

    public class Personel : Personel<int> {
        
    }

   
}
