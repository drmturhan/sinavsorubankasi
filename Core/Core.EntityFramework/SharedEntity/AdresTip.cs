using Core.Base;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.EntityFramework.SharedEntity
{

    public class Foto : Foto<int>
    {

    }

    public class Foto<TKey> : EBase, IEntity<TKey> where TKey : IEquatable<TKey>
    {
        public TKey FotoId { get; set; }
        public int KisiNo { get; set; }
        public string DisKaynakId { get; set; }
        public string DosyaAdi { get; set; }
        public string Url { get; set; }
        public string Aciklama { get; set; }
        public DateTime EklenmeTarihi { get; set; }
        public bool ProfilFotografi { get; set; }
        public string PublicId { get; set; }

        [NotMapped]
        public TKey Kimlik { get { return FotoId; } set { FotoId = value; } }
    }

    public class AdresTip : AdresTip<int>
    {

    }
    public class AdresTip<TKey> : EBase, IEntity<TKey> where TKey : IEquatable<TKey>
    {
        public TKey AdresTipId { get; set; }
        public string AdresTipAdi { get; set; }
        [NotMapped]
        public TKey Kimlik { get { return AdresTipId; } set { AdresTipId = value; } }
    }
}
