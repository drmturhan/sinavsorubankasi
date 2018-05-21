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

    public class SoruKontrol
    {

        public int Id { get; set; }
        public int SoruNo { get; set; }
        public Soru Sorusu { get; set; }
        public int PersonelNo { get; set; }
        public Personel PersonelBilgisi { get; set; }
        public DateTime Tarih { get; set; }
        public int KontrolListeTanimNo { get; set; }
        public KontrolListeTanim KontrolListeTanimi { get; set; }
        public bool SinavdaCikabilir { get; set; }
        public ICollection<SoruKontrolDetay> Detaylari { get; set; } = new List<SoruKontrolDetay>();


    }

    public class SoruKontrolDetay
    {

        public int Id { get; set; }
        public int SoruKontrolNo { get; set; }
        public SoruKontrol KontrolBilgisi { get; set; }
        public string Yorum { get; set; }
        public string Degeri { get; set; }
        public int Puan { get; set; }
    }

    public class KontrolListeGrupTanim
    {
        public int Id { get; set; }
        public string GrupAdi { get; set; }

        public int Sira { get; set; }
        public ICollection<KontrolListeTanim> Listeleri { get; set; } = new List<KontrolListeTanim>();
    }

    public class KontrolListeTanim
    {
        public int Id { get; set; }
        public string Cumle { get; set; }
        public int Sira { get; set; }
        public int KontrolListeGrupNo { get; set; }
        public KontrolListeGrupTanim Grubu { get; set; }
        public int KontrolDegerGrupTanimNo { get; set; }
        public KontrolDegerGrupTanim DegerGrubu { get; set; }


    }


    public class KontrolDegerGrupTanim
    {
        public int Id { get; set; }
        public string DegerGrupAdi { get; set; }
        public string AcikUcluDeger { get; set; }
        public ICollection<KontrolListeTanim> KontrolListesi { get; set; } = new List<KontrolListeTanim>();
        public ICollection<KontrolDegerTanim> DegerListesi { get; set; } = new List<KontrolDegerTanim>();

    }

    public class KontrolDegerTanim
    {
        public int Id { get; set; }
        public int KontrolDegerGrupTanimNo { get; set; }
        public KontrolDegerGrupTanim DegerGrubu { get; set; }
        public string Deger { get; set; }
        public string Aciklama { get; set; }
        public int Puan { get; set; }

    }



}
