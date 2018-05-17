using Core.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.EntityFramework.SharedEntity
{

    public class Cinsiyet : Cinsiyet<int>
    {

    }
    public class Cinsiyet<TKey> : EBase, IEntity<TKey> where TKey : IEquatable<TKey>
    {
        public TKey CinsiyetId { get; set; }
        public string CinsiyetAdi { get; set; }
        [NotMapped]
        public TKey Kimlik { get { return CinsiyetId; } set { CinsiyetId = value; } }
    }
}
