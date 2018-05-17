using Core.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.EntityFramework.SharedEntity
{
    public class Kita : Kita<int>
    {

    }

    public class Kita<TKey> : EBase, IEntity<TKey> where TKey : IEquatable<TKey>
    {
        public TKey KitaId { get; set; }
        public string KitaAdi { get; set; }
        [NotMapped]
        public TKey Kimlik { get { return KitaId; } set { KitaId = value; } }
    }

    
}
