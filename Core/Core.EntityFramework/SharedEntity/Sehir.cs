using Core.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.EntityFramework.SharedEntity
{

    public class Sehir : Sehir<int>
    {

    }

    public class Sehir<TKey> : EBase, IEntity<TKey> where TKey : IEquatable<TKey>
    {
        public TKey SehirId { get; set; }
        public string SehirAdi { get; set; }
        public TKey BolgeNo { get; set; }
        [NotMapped]
        public TKey Kimlik { get { return SehirId; } set { SehirId = value; } }
    }
}
