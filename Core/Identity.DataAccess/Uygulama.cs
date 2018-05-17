using Core.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Identity.DataAccess
{
    public class Uygulama : Uygulama<int>
    {
        public ICollection<Kullanici> Kullanicilari { get; set; } = new List<Kullanici>();
    }
    public class Uygulama<TKey> : EBase, IEntity<TKey> where TKey : IEquatable<TKey>
    {
        public TKey UygulamaId { get; set; }
        public string UygulamaAdi { get; set; }
        [NotMapped]
        public TKey Kimlik { get { return UygulamaId; } set { UygulamaId = value; } }
    }
}
