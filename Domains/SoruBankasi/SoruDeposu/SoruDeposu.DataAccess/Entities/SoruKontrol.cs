using System;
using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Entities
{
    public class SoruKontrol
    {

        public int Id { get; set; }
        public int SoruNo { get; set; }
        public Soru Sorusu { get; set; }
        public int PersonelNo { get; set; }
        public Personel PersonelBilgisi { get; set; }
        public DateTime Tarih { get; set; }
        public int SoruTipiKontrolTanimNo { get; set; }
        public SoruTipiKontrolTanim SoruTipiKontrolTanimi { get; set; }
        public bool SinavdaCikabilir { get; set; }
        public ICollection<SoruKontrolDetay> Detaylari { get; set; } = new List<SoruKontrolDetay>();

    }

    public class SoruKontrolDetay
    {

        public int Id { get; set; }
        public int SoruKontrolNo { get; set; }
        public SoruKontrol KontrolBilgisi { get; set; }

        public int KontrolIcerikTanimNo { get; set; }
        public KontrolListesiMaddeTanim KontrolIcerikTanimi { get; set; }

        public string Yorum { get; set; }
        public string Degeri { get; set; }
        public int Puan { get; set; }

    }

    public class SoruTipiKontrolTanim
    {

        public int Id { get; set; }

        public int SoruTipNo { get; set; }
        public SoruTip SoruTipi { get; set; }
        public string KontrolAdi { get; set; }
        public int GerekliPuan { get; set; }
        public DateTime Baslangic { get; set; }
        public DateTime? Bitis { get; set; }
    }


    public class KontrolListesiGrupTanim
    {
        public int Id { get; set; }
        public string GrupAdi { get; set; }
        public int Sira { get; set; }
        public ICollection<KontrolListesiMaddeTanim> Listeleri { get; set; } = new List<KontrolListesiMaddeTanim>();

    }

    public class KontrolListesiMaddeTanim
    {
        public int Id { get; set; }
        public int SoruTipKontrolNo { get; set; }
        public SoruTipiKontrolTanim SoruTipiKontrolu { get; set; }

        public string Cumle { get; set; }
        public int Sira { get; set; }
        public int? KontrolListeGrupNo { get; set; }
        public KontrolListesiGrupTanim ListeGrubu { get; set; }
        public int KontrolDegerGrupTanimNo { get; set; }
        public KontrolListesiDegerGrupTanim DegerGrubu { get; set; }
        public int SartDegerTanimNo { get; set; }
        public KontrolListesiDegerGrupTanim KontrolListesiDegerGrupTanimi { get; set; }
        public string SartDegeri { get; set; }

    }


    public class KontrolListesiDegerGrupTanim
    {
        public int Id { get; set; }
        public string DegerGrupAdi { get; set; }
        public string AcikUcluDeger { get; set; }
        public ICollection<KontrolListesiMaddeTanim> MaddeTanimListesi { get; set; } = new List<KontrolListesiMaddeTanim>();
        public ICollection<KontrolListesiDegerTanim> DegerListesi { get; set; } = new List<KontrolListesiDegerTanim>();

    }

    public class KontrolListesiDegerTanim
    {
        public int Id { get; set; }
        public int KontrolDegerGrupTanimNo { get; set; }
        public KontrolListesiDegerGrupTanim DegerGrubu { get; set; }
        public string Deger { get; set; }
        public string Aciklama { get; set; }
        public int Puan { get; set; }

    }

}
