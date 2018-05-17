using Core.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.EntityFramework.SharedEntity
{
    public class Bolge : Bolge<int>
    {

    }

    public class Bolge<TKey> : EBase, IEntity<TKey> where TKey : IEquatable<TKey>
    {
        public TKey BolgeId { get; set; }
        public string BolgeAdi { get; set; }

        public TKey UlkeNo { get; set; }
        [NotMapped]
        public TKey Kimlik { get { return BolgeId; } set { BolgeId = value; } }
    }

   
}
