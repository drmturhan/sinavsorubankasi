using Core.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.EntityFramework.SharedEntity
{
    public class Mesaj<TKey> : EBase, IEntity<TKey> where TKey : IEquatable<TKey>
    {
        public TKey MesajId { get; set; }
        public TKey GonderenNo { get; set; }
        public TKey AlanNo { get; set; }
        public string Icerik { get; set; }
        public bool Okundu { get; set; }
        public DateTime? GonderilmeZamani { get; set; }
        public DateTime? OkunmaZamani { get; set; }
        public bool AlanSildi { get; set; }
        public bool GonderenSildi { get; set; }
        [NotMapped]
        public TKey Kimlik { get { return MesajId; } set { MesajId = value; } }
    }
}
