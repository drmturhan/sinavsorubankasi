using Core.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.EntityFramework.SharedEntity
{
    public class Ilce : Ilce<int>
    {

    }

    public class Ilce<TKey> : EBase, IEntity<TKey> where TKey : IEquatable<TKey>
    {
        public TKey IlceId { get; set; }
        public string IlceAdi { get; set; }

        public TKey SehirNo { get; set; }

        [NotMapped]
        public TKey Kimlik { get { return IlceId; } set { IlceId = value; } }

    }
}
