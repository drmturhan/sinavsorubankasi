using System;
using System.Collections.Generic;
using System.Text;

namespace SoruDeposu.DataAccess.Dtos
{

    
    public class SoruListeDto
    {
        public int SoruId { get; set; }
        public int? BirimNo { get; set; }

        public int DersNo { get; set; }
        public string DersAdi { get; set; }
        public string KonuAdi { get; set; }
        public int KonuNo { get; set; }

        public int SoruTipNo { get; set; }
        public string SoruTipAdi { get; set; }
        public int SoruZorlukNo { get; set; }
        public string SoruZorlukAdi { get; set; }

        public string Kaynakca { get; set; }
        public string SoruMetni { get; set; }
        public int SoruKokuNo { get; set; }
        public string SoruKokuMetni { get; set; }
        public int SoruKokuSorulariSayisi { get; set; }
        public int? SecenekSayisi { get; set; }
        public DateTime Baslangic { get; set; }
        public DateTime? Bitis { get; set; }
        public string Aciklama { get; set; }
        public int HemenElenebilirSecenekSayisi { get; set; }
        public decimal KabulEdilebilirlikIndeksi { get; set; }
        public int BilisselDuzeyNo { get; set; }
        public string BilisselDuzeyAdi { get; set; }
        public int CevaplamaSuresi { get; set; }
        public string[] AnahtarKelimeler { get; set; }
        public ICollection<OgrenimHedefDto> SoruHedefleri { get; set; } = new List<OgrenimHedefDto>();
        public ICollection<TekDogruluSoruSecenekDto> TekDogruluSecenekleri { get; set; } = new List<TekDogruluSoruSecenekDto>();
        public bool? Aktif { get; set; }
        public bool? Onaylandi { get; set; }
        public bool? Favori { get; set; }
        public bool? Silinemez { get; set; }
    }


    //Bu sınıfta onaylandı yok. Onaylama süreci ayrıca yönetilecek
    public class SoruYaratDto
    {
        public int? SoruKokuNo { get; set; }
        public int? BirimNo { get; set; }
        public int? ProgramNo { get; set; }
        public int? DonemNo { get; set; }
        public int? DersGrubuNo { get; set; }
        public int DersNo { get; set; }

        public int? KonuNo { get; set; }
        public int SoruTipNo { get; set; }
        public int SoruZorlukNo { get; set; }
        
        public string SoruMetni { get; set; }
        public DateTime Baslangic { get; set; }
        public DateTime? Bitis { get; set; }
        public string Aciklama { get; set; }
        public string Kaynakca { get; set; }
        public string[] AnahtarKelimeler { get; set; }
        public int HemenElenebilirSecenekSayisi { get; set; }
        public decimal KabulEdilebilirlikIndeksi { get; set; }
        public int BilisselDuzeyNo { get; set; }
        public int CevaplamaSuresi { get; set; }

        public int? PersonelNo { get; set; }
        public bool? Aktif { get; set; }
        public bool? Favori { get; set; }
        public ICollection<int> SoruHedefleri { get; set; } = new List<int>();
        public ICollection<TekDogruluSoruSecenekDto> TekDogruluSecenekleri { get; set; } = new List<TekDogruluSoruSecenekDto>();

    }
    public class SoruDegistirDto : SoruYaratDto
    {
        public int SoruId { get; set; }
    }

    public class SoruAlanDegistirDto
    {
        public int SoruNo { get; set; }
        public bool? Ac { get; set; }
        public bool? Favori { get; set; }
        public bool? Silindi { get; set; }
    }

    public class SoruKokuAlanDegistirDto: SoruAlanDegistirDto
    {
        public int SoruKokuNo { get; set; }
        
    }

    public class TekDogruluSoruSecenekDto
    {
        public int TekDogruluSoruSecenekId { get; set; }
        public string SecenekMetni { get; set; }
        public bool DogruSecenek { get; set; }
        public bool? HemenElenebilir { get; set; }

    }


    public class SoruBirimDto
    {

        public int BirimId { get; set; }
        public string BirimAdi { get; set; }
        public List<SoruProgramDto> Programlari { get; set; } = new List<SoruProgramDto>();

    }
    public class SoruProgramDto
    {
        public int ProgramId { get; set; }
        public string ProgramAdi { get; set; }
        public List<ProgramDonemDto> Donemleri { get; set; } = new List<ProgramDonemDto>();

    }
    public class ProgramDonemDto
    {
        public int DonemId { get; set; }
        public int Sinifi { get; set; }
        public int DonemNumarasi { get; set; }
        public string DonemAdi { get; set; }
        public List<DersGrupDto> DersGruplari { get; set; } = new List<DersGrupDto>();
    }
    public class DersGrupDto
    {

        public int DersGrupId { get; set; }
        public string GrupAdi { get; set; }
        public bool Staj { get; set; }
        public bool DersKurulu { get; set; }
        public List<DersDto> Dersleri { get; set; } = new List<DersDto>();

    }

    public class DersDto
    {

        public int DersId { get; set; }
        public string DersAdi { get; set; }
        public List<KonuDto> Konulari { get; set; } = new List<KonuDto>();
        public List<OgrenimHedefDto> OgrenimHedefleri { get; set; } = new List<OgrenimHedefDto>();
        public List<HocaDto> AnlatanHocalar { get; set; } = new List<HocaDto>();

    }

    public class KonuDto
    {
        public int KonuId { get; set; }
        public int DersNo { get; set; }
        public string KonuAdi { get; set; }
        public List<OgrenimHedefDto> OgrenimHedefleri { get; set; } = new List<OgrenimHedefDto>();
        public List<HocaDto> AnlatanHocalar { get; set; } = new List<HocaDto>();
    }
    public class OgrenimHedefDto
    {
        public int OgrenimHedefId { get; set; }
        public string OgrenimHedefAdi { get; set; }
    }
    public class AlanKodDto
    {
        public int AlanKodId { get; set; }
        public string AlanKodu { get; set; }
    }

    public class HocaDto
    {
        public int DersHocaId { get; set; }
        public int PersonelNo { get; set; }
        public string UnvanAdSoyad { get; set; }
    }
    public class SoruTipDto
    {

        public int SoruTipId { get; set; }
        public string SoruTipAdi { get; set; }
    }
    public class BilisselDuzeyDto
    {

        public int BilisselDuzeyId { get; set; }
        public string DuzeyAdi { get; set; }
    }

    public class SoruZorlukDto
    {
        public int ZorlukId { get; set; }
        public string ZorlukAdi { get; set; }
    }




    public class KontrolListeGrupTanimDto
    {
        public int Id { get; set; }
        public string GrupAdi { get; set; }

        public int Sira { get; set; }
        public ICollection<KontrolListeTanimDto> Listeleri { get; set; } = new List<KontrolListeTanimDto>();
    }

    public class KontrolListeTanimDto
    {
        public int Id { get; set; }
        public string Cumle { get; set; }
        public int KontrolListeGrupNo { get; set; }
        public KontrolListeGrupTanimDto Grubu { get; set; }
        public int KontrolDegerGrupTanimNo { get; set; }
        public KontrolDegerGrupTanimDto DegerGrubu { get; set; }


    }


    public class KontrolDegerGrupTanimDto
    {
        public int Id { get; set; }
        public string DegerGrupAdi { get; set; }
        public string AcikUcluDeger { get; set; }
        public ICollection<KontrolListeTanimDto> KontrolListesi { get; set; } = new List<KontrolListeTanimDto>();
        public ICollection<KontrolDegerTanim> DegerListesi { get; set; } = new List<KontrolDegerTanim>();

    }

    public class KontrolDegerTanim
    {
        public int Id { get; set; }
        public int KontrolDegerGrupTanimNo { get; set; }
        public KontrolDegerGrupTanimDto DegerGrubu { get; set; }
        public string Deger { get; set; }
        public string Aciklama { get; set; }
        public int Puan { get; set; }

    }


}
