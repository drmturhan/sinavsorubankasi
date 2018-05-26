using AutoMapper;
using SoruDeposu.DataAccess.Dtos;
using SoruDeposu.DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SoruDeposu.DataAccess.Mappers
{
    public class SoruProfile : Profile
    {
        public SoruProfile()
        {

            CreateEntityToResourceMap();
            CreateResourceToEntityMap();
        }

        private void CreateEntityToResourceMap()
        {


            CreateMap<SoruTip, SoruTipDto>();
            CreateMap<SoruZorluk, SoruZorlukDto>();


            CreateMap<OgrenimHedef, OgrenimHedefDto>();
            CreateMap<TekDogruluSoruSecenek, TekDogruluSoruSecenekDto>();

            CreateMap<BilisselDuzey, BilisselDuzeyDto>()
                .ForMember(d => d.DuzeyAdi, islem => islem.ResolveUsing(e => e.BilisselDuzyeAdi));


            CreateMap<Soru, SoruListeDto>()
                .ForMember(d => d.SoruHedefleri, islem => islem.Ignore())
                //.ForMember(d => d.TekDogruluSecenekleri, islem => islem.Ignore())
                .ForMember(d => d.AnahtarKelimeler, islem => islem.Ignore())
                .ForMember(d => d.SoruTipAdi, islem => islem.ResolveUsing(e => e.SoruTipi.SoruTipAdi))
                .ForMember(d => d.SoruZorlukAdi, islem => islem.ResolveUsing(e => e.SoruZorluk.ZorlukAdi))
                .ForMember(d => d.BilisselDuzeyAdi, islem => islem.ResolveUsing(e => e.BilisselDuzeyi != null ? e.BilisselDuzeyi.BilisselDuzyeAdi : ""))
                .ForMember(d => d.SoruKokuMetni, islem => islem.ResolveUsing(e => e.SoruKoku != null ? e.SoruKoku.SoruKokuMetni : string.Empty))
                .ForMember(d => d.SoruKokuSorulariSayisi, islem => islem.ResolveUsing(e => e.SoruKoku != null ? e.SoruKoku.Sorulari.Count : 0))
                .ForMember(d => d.DersAdi, islem => islem.ResolveUsing(e => e.Dersi != null ? e.Dersi.DersAdi : string.Empty))
                .ForMember(d => d.KonuAdi, islem => islem.ResolveUsing(e => e.Konusu != null ? e.Konusu.KonuAdi : string.Empty))
                .AfterMap((e, d) =>
                {
                    //foreach (var item in e.TekDogruluSecenekleri)
                    //{
                    //    d.TekDogruluSecenekleri.Add(item.ToDto());
                    //}

                    foreach (var shBagi in e.SoruHedefleri)
                    {
                        if (shBagi.Hedefi != null)
                        {
                            d.SoruHedefleri.Add(shBagi.Hedefi.ToDto());
                        }
                    }
                    if (e.AnahtarKelimeler != null)
                        d.AnahtarKelimeler = e.AnahtarKelimeler.Split(';');

                });

            CreateMap<Soru, SoruDegistirDto>()
                .ForMember(d => d.SoruHedefleri, islem => islem.Ignore())
                .ForMember(d => d.AnahtarKelimeler, islem => islem.Ignore())
                .AfterMap((e, d) =>
                {
                    foreach (var shBagi in e.SoruHedefleri)
                    {
                        if (shBagi.Hedefi != null)
                        {
                            d.SoruHedefleri.Add(shBagi.Hedefi.OgrenimHedefId);
                        }
                    }

                    if (e.AnahtarKelimeler != null)
                        d.AnahtarKelimeler = e.AnahtarKelimeler.Split(';');
                });

            CreateMap<SoruKoku, SoruKokuListeDto>().AfterMap((e, d) =>
            {
                if (e.Sorulari.Count > 0)
                {
                    var ilkSoru = e.Sorulari.First();
                    if (ilkSoru.Dersi != null)
                    {
                        d.DersAdi = ilkSoru.Dersi.DersAdi;
                        d.DersNo = ilkSoru.DersNo;
                    }
                    if (ilkSoru.Dersi != null)
                    {
                        d.DersAdi = ilkSoru.Konusu.KonuAdi;
                        d.KonuNo = ilkSoru.KonuNo;
                    }
                    var silinecekListe = e.Sorulari.Where(s => s.Silindi == true).Select(s => s.SoruId).ToList();
                    var liste = e.Sorulari.ToList();
                    for (int i = 0; i < d.Sorulari.Count; i++)
                    {
                        var item = d.Sorulari.ElementAt(i);
                        if (silinecekListe.Contains(item.SoruId))
                        {
                            d.Sorulari.Remove(item);
                            i--;
                        }
                    }

                }
            });

        }

        private void CreateResourceToEntityMap()
        {
            CreateMap<SoruYaratDto, Soru>()
                .BeforeMap((d, e) =>
                {
                    e.SoruId = 0;
                })
                .ForMember(e => e.SoruHedefleri, islem => islem.Ignore())
                .ForMember(e => e.TekDogruluSecenekleri, islem => islem.Ignore())
                .ForMember(e => e.AnahtarKelimeler, islem => islem.Ignore())
                .AfterMap((d, e) =>
                {

                    foreach (var secenek in d.TekDogruluSecenekleri)
                    {
                        var yeniEntity = secenek.ToEntity();
                        if (yeniEntity.TekDogruluSoruSecenekId <= 0)
                        {
                            yeniEntity.TekDogruluSoruSecenekId = null;
                        }
                        e.TekDogruluSecenekleri.Add(yeniEntity);
                    }

                    foreach (var sh in d.SoruHedefleri)
                    {
                        e.SoruHedefleri.Add(new SoruHedefBag
                        {
                            SoruNo = e.SoruId,
                            OgrenimHedefNo = sh
                        });
                    }
                    string kelimeler = "";
                    foreach (var ak in d.AnahtarKelimeler)
                    {
                        kelimeler = string.Format("{0};{1}", kelimeler, ak);
                    }
                    kelimeler = kelimeler.TrimStart(';');
                    e.AnahtarKelimeler = kelimeler;
                    if (e.KonuNo == 0)
                        e.KonuNo = null;
                    e.SecenekSayisi = e.TekDogruluSecenekleri.Count;
                });
            CreateMap<SoruDegistirDto, Soru>()
                .ForPath(e => e.SoruHedefleri, islem => islem.Ignore())
                .ForPath(e => e.TekDogruluSecenekleri, islem => islem.Ignore())
                .AfterMap((d, e) =>
                {
                    SoruHedefleriniYonet(d, e);
                    TekDogruluSecenekleriYonet(d, e);
                    string kelimeler = "";
                    foreach (var ak in d.AnahtarKelimeler)
                    {
                        kelimeler = string.Format("{0};{1}", kelimeler, ak);
                    }
                    kelimeler = kelimeler.TrimStart(';');
                    e.AnahtarKelimeler = kelimeler;
                    if (e.KonuNo == 0)
                        e.KonuNo = null;
                    e.SecenekSayisi = e.TekDogruluSecenekleri.Count;
                });

            CreateMap<SoruKokuListeDto, SoruKoku>();
            CreateMap<SoruKokuYaratDto, SoruKoku>();
            CreateMap<SoruKokuDegistirDto, SoruKoku>();

            CreateMap<TekDogruluSoruSecenekDto, TekDogruluSoruSecenek>();
            CreateMap<SoruTipDto, SoruTip>();
            CreateMap<OgrenimHedefDto, OgrenimHedef>();
        }

        private void SoruHedefleriniYonet(SoruDegistirDto d, Soru e)
        {
            SoruHedefleriYonetici yonetici = new SoruHedefleriYonetici(d, e);
            yonetici.Yonet();

        }

        private void TekDogruluSecenekleriYonet(SoruDegistirDto d, Soru e)
        {
            TekDogruluSecenekYonetici yonetici = new TekDogruluSecenekYonetici(d, e);
            yonetici.Yonet();
        }




    }
}
