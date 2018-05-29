using System;
using System.Collections.Generic;
using System.Text;

namespace SoruDeposu.DataAccess.Entities
{

    public class Soru
    {

        public int SoruId { get; set; }

        public int? BirimNo { get; set; }
        public int? ProgramNo { get; set; }
        public int? DonemNo { get; set; }
        public int? DersGrubuNo { get; set; }

        public int? DersNo { get; set; }
        public Ders Dersi { get; set; }
        public int? KonuNo { get; set; }
        public Konu Konusu { get; set; }
        public int? SoruKokuNo { get; set; }
        public SoruKoku SoruKoku { get; set; }
        public int? SoruTipNo { get; set; }
        public int SoruZorlukNo { get; set; }
        public SoruZorluk SoruZorluk { get; set; }
        public SoruTip SoruTipi { get; set; }

        public string SoruMetni { get; set; }
        public DateTime Baslangic { get; set; }
        public DateTime? Bitis { get; set; }
        public string Aciklama { get; set; }
        public string Kaynakca { get; set; }
        public string AnahtarKelimeler { get; set; }

        public int HemenElenebilirSecenekSayisi { get; set; }
        public decimal KabulEdilebilirlikIndeksi { get; set; }
        public int? BilisselDuzeyNo { get; set; }
        public BilisselDuzey BilisselDuzeyi { get; set; }
        public int CevaplamaSuresi { get; set; }
        public ICollection<SoruHedefBag> SoruHedefleri { get; set; } = new List<SoruHedefBag>();
        public ICollection<TekDogruluSoruSecenek> TekDogruluSecenekleri { get; set; } = new List<TekDogruluSoruSecenek>();
        public int SecenekSayisi { get; set; }
        public int? PersonelNo { get; set; }
        public bool? Aktif { get; set; }
        public bool? Onaylandi { get; set; }
        public bool? Favori { get; set; }
        public bool? Silinemez { get; set; }
        public bool? Silindi { get; set; }
        public ICollection<SoruKontrol> SoruKontrolleri { get; set; } = new List<SoruKontrol>();

    }

}
