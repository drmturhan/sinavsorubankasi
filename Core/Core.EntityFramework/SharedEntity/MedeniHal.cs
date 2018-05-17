using Core.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.EntityFramework.SharedEntity
{

    public class MedeniHal : MedeniHal<int>
    {

    }

    public class MedeniHal<TKey> : EBase, IEntity<TKey> where TKey : IEquatable<TKey>
    {
        public TKey MedeniHalId { get; set; }
        public string MedeniHalAdi { get; set; }
        [NotMapped]
        public TKey Kimlik { get { return MedeniHalId; } set { MedeniHalId = value; } }
    }
}
