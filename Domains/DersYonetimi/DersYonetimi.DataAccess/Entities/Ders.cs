using System;
using System.Collections.Generic;
using System.Text;

namespace DersYonetimi.DataAccess.Entities
{

    public class Ders : DersBase
    {
        public AlanKod AlanKodu { get; set; }
        public ICollection<Konu> Konulari { get; set; } = new List<Konu>();
        public ICollection<DersHoca> AnlatanHocalar { get; set; } = new List<DersHoca>();
        public ICollection<OgrenimHedef> OgrenimHedefleri { get; set; } = new List<OgrenimHedef>();
        public ICollection<GrupDers> Gruplari { get; set; } = new List<GrupDers>();
    }

    public class GrupDers
    {
        public int DersGrupNo { get; set; }
        public DersGrup DersGrubu { get; set; }
        public int DersNo { get; set; }
        public Ders Dersi { get; set; }

    }


    public class DersGrup
    {
        public int DersGrupId { get; set; }
        public int MufredatNo { get; set; }
        public Mufredat Mufredati { get; set; }
        public int DonemNo { get; set; }
        public Donem Donemi { get; set; }
        public string GrupAdi { get; set; }
        public bool Staj { get; set; }
        public bool DersKurulu { get; set; }

        public ICollection<GrupDers> Dersleri { get; set; } = new List<GrupDers>();


    }
    public class Donem : DonemBase
    {
        public Program Programi { get; set; }
        public ICollection<DersGrup> DersGruplari { get; set; } = new List<DersGrup>();

    }
    public class Program : ProgramBase
    {
        public Birim Birimi { get; set; }
        public ICollection<Donem> Donemleri { get; set; } = new List<Donem>();

    }

    public class Birim : BirimBase
    {

        public Universite Universitesi { get; set; }
        public BirimGrup Grubu { get; set; }
        public Birim UstBirim { get; set; }
        public Personel AkademikAmir { get; set; }
        public Personel IdariAmir { get; set; }
        public ICollection<Program> Programlari { get; set; } = new List<Program>();
        public ICollection<Birim> AltBirimleri { get; set; } = new List<Birim>();
        public ICollection<BirimPersonel> Personelleri { get; set; } = new List<BirimPersonel>();

    }
    public class BirimPersonel
    {
        public int BirimPersonelId { get; set; }
        public int BirimNo { get; set; }
        public Birim Birimi { get; set; }
        public int? PersonelNo { get; set; }
        public Personel PersonelBilgisi { get; set; }
        public int? PozisyonNo { get; set; }
        public Pozisyon Pozsiyonu { get; set; }
        public DateTime Baslangic { get; set; }
        public DateTime? Bitis { get; set; }


    }

    public class BirimGrup : BirimGrupBase
    {
        public BirimGrup UstGrubu { get; set; }
        public Pozisyon IdariAmirPozisyonu { get; set; }
        public Pozisyon AkademikAmirPozisyonu { get; set; }
        public ICollection<Birim> Birimleri { get; set; } = new List<Birim>();
        public ICollection<BirimGrup> AltBirimleri { get; set; } = new List<BirimGrup>();

    }
    public class Pozisyon : PozisyonBase
    {
        public ICollection<PozisyonGrup> GrupTanimlari { get; set; } = new List<PozisyonGrup>();
        public ICollection<BirimPersonel> BirimPersonelListesi { get; set; } = new List<BirimPersonel>();
        public ICollection<BirimGrup> AkademikYonettigiBirimGruplari { get; set; } = new List<BirimGrup>();
        public ICollection<BirimGrup> IdariYonettigiBirimGruplari { get; set; } = new List<BirimGrup>();

    }
    public class PozisyonGrup
    {
        public int PozisyonNo { get; set; }
        public Pozisyon Pozisyonu { get; set; }
        public int PozisyonGrupTanimNo { get; set; }
        public PozisyonGrupTanim PozisyonGrupTanimi { get; set; }

    }
    public class PozisyonGrupTanim : PozisyonGrupTanimBase
    {
        public ICollection<PozisyonGrup> Pozisyonlari { get; set; } = new List<PozisyonGrup>();
    }
    public class Universite : UniversiteBase
    {

        public Personel AkademikAmir { get; set; }
        public Personel IdariAmir { get; set; }
        public ICollection<Birim> Birimleri { get; set; } = new List<Birim>();

    }
    public class Mufredat
    {
        public int MufredatId { get; set; }
        public int Yil { get; set; }
        public ICollection<DersGrup> DersGruplari { get; set; } = new List<DersGrup>();
    }

    public class AlanKod
    {

        public int AlanKodId { get; set; }
        public string AlanKodAdi { get; set; }
        public ICollection<Ders> Dersleri { get; set; } = new List<Ders>();
    }
    public class Konu : KonuBase
    {
        public Ders Dersi { get; set; }
        public ICollection<OgrenimHedef> OgrenimHedefleri { get; set; } = new List<OgrenimHedef>();
        public ICollection<DersHoca> AnlatanHocalar { get; set; } = new List<DersHoca>();
    }
    public class DersHoca
    {

        public int DersHocaId { get; set; }
        public int? DersNo { get; set; }
        public Ders Dersi { get; set; }
        public int? KonuNo { get; set; }
        public Konu Konusu { get; set; }
        public int? PersonelNo { get; set; }
        public Personel PersonelBilgisi { get; set; }
        public int KuramsalSaati { get; set; }
        public int UygualamaSaati { get; set; }
    }

    public class OgrenimHedef : OgrenimHedefBase
    {

        public Ders Dersi { get; set; }
        public Konu Konusu { get; set; }


    }
    public class Personel
    {
        public int PersonelId { get; set; }
        public int KisiNo { get; set; }
        public Kisi KisiBilgisi { get; set; }

        public ICollection<DersHoca> Anlattiklari { get; set; } = new List<DersHoca>();

    }
    public class Kisi
    {
        public int KisiId { get; set; }
        public string Unvan { get; set; }
        public string Ad { get; set; }
        public string Soyad { get; set; }
        public string DigerAd { get; set; }
        public DateTime DogumTarihi { get; set; }
        public int CinsiyetNo { get; set; }
        public int MedeniHalNo { get; set; }
        public ICollection<Personel> Personellikleri { get; set; } = new List<Personel>();
    }


    public class OgrenmeDuzey
    {
        public string Kod { get; set; }
        public string Aciklama { get; set; }
    }

    public class SemptomDurumGrup : SemptomDurumGrupBase
    {
        public List<SemptomDurum> Semptomlari { get; set; }


    }
    public class SemptomDurum : SemptomDurumBase
    {
        public SemptomDurumGrup Grubu { get; set; }

    }

    public class OrganSistem
    {

        public string Kod { get; set; }
        public string Ad { get; set; }
        public List<CekirdekHastalik> CekirdekHastaliklari { get; set; }

    }
    public class CekirdekHastalik : CekirdekHastalikBase
    {

        public OrganSistem OrganSistemi { get; set; }


    }
    public class DersKonuCekirdekHastalik
    {

        public DersBase Ders { get; set; }
        public KonuBase Konu { get; set; }
        public SemptomDurumGrup SemptomGrubu { get; set; }
        public CekirdekHastalik CekirdekHastaligi { get; set; }
        public OrganSistem OrganSistemi { get; set; }
    }
}
