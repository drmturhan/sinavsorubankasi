using Core.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.EntityFramework.SharedEntity
{
    public class KisiEposta : KisiEposta<int>
    {
        public int KisiNo { get; set; }
    }
    public class KisiEposta<TKey> : EBase, IEntity<TKey> where TKey : IEquatable<TKey>
    {
        public TKey KisiEpostaId { get; set; }
        public string KisiEpostasi { get; set; }

        public string Aciklama { get; set; }
        [NotMapped]
        public TKey Kimlik { get { return KisiEpostaId; } set { KisiEpostaId = value; } }
    }
}
