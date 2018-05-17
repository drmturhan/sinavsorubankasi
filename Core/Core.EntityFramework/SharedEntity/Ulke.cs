using Core.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.EntityFramework.SharedEntity
{

    public class Ulke : Ulke<int>
    {

    }
    public class Ulke<TKey> : EBase, IEntity<TKey> where TKey : IEquatable<TKey>
    {
        public TKey UlkeId { get; set; }
        public string UlkeAdi { get; set; }

        public TKey KitaNo { get; set; }
        [NotMapped]
        public TKey Kimlik { get { return UlkeId; } set { UlkeId = value; } }
    }
}
