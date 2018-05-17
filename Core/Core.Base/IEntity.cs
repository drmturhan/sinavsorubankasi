using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Base
{
    public interface IEntity<TKey> where TKey : IEquatable<TKey>
    {
        TKey Kimlik { get; set; }
        string ConcurrencyStamp { get; set; }
    }

    public class EBase
    {
        [NotMapped]
        public virtual string ConcurrencyStamp { get; set; } = Guid.NewGuid().ToString();
    }
}
