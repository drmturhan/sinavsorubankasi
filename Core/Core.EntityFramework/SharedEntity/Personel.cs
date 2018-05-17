using Core.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.EntityFramework.SharedEntity
{
    public class Personel<TKey> : EBase, IEntity<TKey> where TKey : IEquatable<TKey>
    {
        public TKey PersonelId { get; set; }

        public TKey KisiNo { get; set; }

        [NotMapped]
        public TKey Kimlik { get { return PersonelId; } set => PersonelId = value; }
    }
}
