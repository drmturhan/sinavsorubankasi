using Core.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.EntityFramework.SharedEntity
{


    public class KisiAdres : KisiAdres<int>
    {
    }
    public class KisiAdres<TKey> : EBase, IEntity<TKey> where TKey : IEquatable<TKey>
    {

        public TKey KisiAdresId { get; set; }
        public int KisiNo { get; set; }
        public int AdresTipNo { get; set; }
        public int KitaNo { get; set; }
        public int UlkeNo { get; set; }
        public int BolgeNo { get; set; }
        public int SehirNo { get; set; }
        public int IlceNo { get; set; }
        public string AdresSatiri { get; set; }
        public string Aciklama { get; set; }

        [NotMapped]
        public TKey Kimlik { get { return KisiAdresId; } set { KisiAdresId = value; } }
    }
}
