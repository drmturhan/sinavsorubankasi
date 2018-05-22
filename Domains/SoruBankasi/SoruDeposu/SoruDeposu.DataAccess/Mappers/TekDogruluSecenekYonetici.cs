using SoruDeposu.DataAccess.Dtos;
using SoruDeposu.DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SoruDeposu.DataAccess.Mappers
{
    internal class TekDogruluSecenekYonetici
    {
        private readonly SoruDegistirDto d;
        private readonly Soru e;

        public TekDogruluSecenekYonetici(SoruDegistirDto dto, Soru entity)
        {
            this.d = dto;
            this.e = entity;
        }
        List<TekDogruluSoruSecenek> silinenler = new List<TekDogruluSoruSecenek>();
        List<TekDogruluSoruSecenek> eklenenler = new List<TekDogruluSoruSecenek>();
        public void Yonet()
        {
            SilinenleriBelirle();
            SilinecekleriSil();
            DegisenVeyaEklenenleriBelirle();
            EklenecekleriEkle();


        }

        private void SilinenleriBelirle()
        {
            foreach (var eItem in e.TekDogruluSecenekleri)
            {
                if (ListedeYok(eItem, d.TekDogruluSecenekleri))
                    silinenler.Add(eItem);
            }
        }

        private void SilinecekleriSil()
        {
            foreach (var silinenKayit in silinenler)
            {
                e.TekDogruluSecenekleri.Remove(silinenKayit);
            }
        }

        private void DegisenVeyaEklenenleriBelirle()
        {
            foreach (var rItem in d.TekDogruluSecenekleri)
            {
                TekDogruluSoruSecenek dbkaydi = DbKaydindanAl(rItem, e.TekDogruluSecenekleri);
                if (dbkaydi == null)
                {
                    dbkaydi = rItem.ToEntity();
                    dbkaydi.TekDogruluSoruSecenekId = null;
                    eklenenler.Add(dbkaydi);
                }
                else
                    rItem.Kopyala(dbkaydi);

            }
        }

        private void EklenecekleriEkle()
        {
            foreach (var eklenenKayit in eklenenler)
            {
                e.TekDogruluSecenekleri.Add(eklenenKayit);
            }
        }
        private bool ListedeYok(TekDogruluSoruSecenek eItem, ICollection<TekDogruluSoruSecenekDto> dListe)
        {
            bool sonuc = true;
            foreach (var item in dListe)
            {
                if (item.TekDogruluSoruSecenekId == eItem.TekDogruluSoruSecenekId)
                {
                    sonuc = false;
                    break;
                }
            }
            return sonuc;
        }
        private TekDogruluSoruSecenek DbKaydindanAl(TekDogruluSoruSecenekDto rItem, ICollection<TekDogruluSoruSecenek> dbListesi)
        {
            foreach (var eItem in dbListesi)
            {
                if (eItem.TekDogruluSoruSecenekId == rItem.TekDogruluSoruSecenekId) return eItem;
            }
            return null;
        }
    }


    internal class SoruHedefleriYonetici
    {
        private readonly SoruDegistirDto d;
        private readonly Soru e;

        public SoruHedefleriYonetici(SoruDegistirDto dto, Soru entity)
        {
            this.d = dto;
            this.e = entity;
        }
        List<SoruHedefBag> silinenler = new List<SoruHedefBag>();
        List<SoruHedefBag> eklenenler = new List<SoruHedefBag>();
        public void Yonet()
        {
            SilinenleriBelirle();
            SilinecekleriSil();
            DegisenVeyaEklenenleriBelirle();
            EklenecekleriEkle();


        }

        private void SilinenleriBelirle()
        {
            foreach (var eItem in e.SoruHedefleri)
            {
                if (ListedeYok(eItem.OgrenimHedefNo.Value, d.SoruHedefleri))
                    silinenler.Add(eItem);
            }
        }

        private void SilinecekleriSil()
        {
            foreach (var silinenKayit in silinenler)
            {
                e.SoruHedefleri.Remove(silinenKayit);
            }
        }

        private void DegisenVeyaEklenenleriBelirle()
        {
            foreach (var rItem in d.SoruHedefleri)
            {
                SoruHedefBag dbkaydi = DbKaydindanAl(rItem, e.SoruHedefleri);
                if (dbkaydi == null)
                {
                    dbkaydi = new SoruHedefBag
                    {
                        SoruNo = e.SoruId,
                        OgrenimHedefNo = rItem
                    };
                    eklenenler.Add(dbkaydi);
                }

            }
        }

        private void EklenecekleriEkle()
        {
            foreach (var eklenenKayit in eklenenler)
            {
                e.SoruHedefleri.Add(eklenenKayit);
            }
        }
        private bool ListedeYok(int eItem, ICollection<int> dListe)
        {
            bool sonuc = true;
            foreach (var item in dListe)
            {
                if (item == eItem)
                {
                    sonuc = false;
                    break;
                }
            }
            return sonuc;
        }

        private SoruHedefBag DbKaydindanAl(int rItem, ICollection<SoruHedefBag> dbListesi)
        {
            foreach (var eItem in dbListesi)
            {
                if (eItem.OgrenimHedefNo == rItem) return eItem;
            }
            return null;
        }
    }
}
