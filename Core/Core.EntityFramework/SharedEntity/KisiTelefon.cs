using Core.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.EntityFramework.SharedEntity
{
    public class KisiTelefon : KisiTelefon<int>
    {

    }
    public class KisiTelefon<TKey> : EBase, IEntity<TKey> where TKey : IEquatable<TKey>
    {
        public TKey KisiTelefonId { get; set; }
        public int KisiNo { get; set; }
        public string KisiTelefonu { get; set; }
        public string Aciklama { get; set; }
        [NotMapped]
        public TKey Kimlik { get { return KisiTelefonId; } set { KisiTelefonId = value; } }
    }
}
