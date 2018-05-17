using AutoMapper;
using Core.Base.Helpers;
using Core.EntityFramework;
using Core.EntityFramework.SharedEntity;
using Identity.DataAccess.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Identity.DataAccess.Mappers
{
    public class KullaniciProfile : Profile
    {
        public KullaniciProfile()
        {

            //CreateMap(typeof(QueryResult<>), typeof(QueryResultResource<>));

            CreateEntityToResourceMap();
            CreateResourceToEntityMap();
        }

        private void CreateEntityToResourceMap()
        {

            CreateMap<Kullanici, KullaniciListeDto>()
                .ForMember(dto => dto.CinsiyetAdi, islem => islem.ResolveUsing(e => e.Kisi.Cinsiyeti.CinsiyetAdi))
                .ForMember(dto => dto.KullaniciAdi, islem => islem.ResolveUsing(e => e.UserName))
                .ForMember(dto => dto.Eposta, islem => islem.ResolveUsing(e => e.Email))
                .ForMember(dto => dto.EpostaOnaylandi, islem => islem.ResolveUsing(e => e.EmailConfirmed))
                .ForMember(dto => dto.TelefonNumarasi, islem => islem.ResolveUsing(e => e.PhoneNumber))
                .ForMember(dto => dto.TelefonOnaylandi, islem => islem.ResolveUsing(e => e.PhoneNumberConfirmed))
                .ForMember(dto => dto.YaratilmaTarihi, islem => islem.ResolveUsing(e => e.YaratilmaTarihi))
                .ForMember(dto => dto.SonAktifOlma, islem => islem.ResolveUsing(e => e.SonAktifOlmaTarihi))
                .ForMember(dto => dto.Yasi, islem => islem.ResolveUsing(e => e.Kisi.DogumTarihi.YasHesapla()))
                .ForMember(dto => dto.TamAdi, islem => islem.ResolveUsing(e => e.TamAdOlustur()))
                .ForMember(dto => dto.ProfilFotoUrl, islem => islem.ResolveUsing(e => e.AsilFotografUrlGetir()));
            CreateMap<Kullanici, ProfilOku>()
                .ForMember(dto => dto.KisiNo, islem => islem.MapFrom(e => e.Kisi.KisiId))
                .ForMember(dto => dto.KullaniciAdi, islem => islem.MapFrom(e => e.UserName))
                .ForMember(dto => dto.Unvan, islem => islem.MapFrom(e => e.Kisi.Unvan))
                .ForMember(dto => dto.Ad, islem => islem.MapFrom(e => e.Kisi.Ad))
                .ForMember(dto => dto.DigerAd, islem => islem.MapFrom(e => e.Kisi.DigerAd))
                .ForMember(dto => dto.Soyad, islem => islem.MapFrom(e => e.Kisi.Soyad))
                .ForMember(dto => dto.Eposta, islem => islem.MapFrom(e => e.Email))
                .ForMember(dto => dto.EpostaOnaylandi, islem => islem.MapFrom(e => e.EmailConfirmed))
                .ForMember(dto => dto.TelefonNumarasi, islem => islem.MapFrom(e => e.PhoneNumber))
                .ForMember(dto => dto.TelefonOnaylandi, islem => islem.MapFrom(e => e.PhoneNumberConfirmed))
                .ForMember(dto => dto.TamAdi, islem => islem.ResolveUsing(e => e.TamAdOlustur()))
                .ForMember(dto => dto.DogumTarihi, islem => islem.MapFrom(e => e.Kisi.DogumTarihi))
                .ForMember(dto => dto.SonAktifOlma, islem => islem.ResolveUsing(e => e.SonAktifOlmaTarihi))
                .ForMember(dto => dto.Yasi, islem => islem.ResolveUsing(e => e.Kisi.DogumTarihi.YasHesapla()))
                .ForMember(dto => dto.CinsiyetNo, islem => islem.MapFrom(e => e.Kisi.CinsiyetNo))
                .ForMember(dto => dto.CinsiyetAdi, islem => islem.MapFrom(e => e.Kisi.Cinsiyeti.CinsiyetAdi))
                .AfterMap((ent, dto) =>
                {
                    dto.Fotograflari = new List<FotoDetayDto>();
                    foreach (var item in ent.Kisi.Fotograflari)
                    {
                        var yeni = item.ToFotoDetayDto();
                        if (yeni.ProfilFotografi)
                            dto.ProfilFotoUrl = yeni.Url;
                        dto.Fotograflari.Add(yeni);
                    }


                });


            CreateMap<Identity.DataAccess.Kullanici, KullaniciBilgi>()
                .ForMember(dto => dto.Eposta, islem => islem.ResolveUsing(e => e.Email))
                .ForMember(dto => dto.EpostaOnaylandi, islem => islem.ResolveUsing(e => e.EmailConfirmed))
                .ForMember(dto => dto.TelefonNumarasi, islem => islem.ResolveUsing(e => e.PhoneNumber))
                .ForMember(dto => dto.TelefonOnaylandi, islem => islem.ResolveUsing(e => e.PhoneNumberConfirmed))
                .ForMember(dto => dto.Yasi, islem => islem.ResolveUsing(e => e.Pasif))
                .ForMember(dto => dto.TamAdi, islem => islem.ResolveUsing(e => e.TamAdOlustur()))
                .ForMember(dto => dto.KullaniciAdi, islem => islem.ResolveUsing(e => e.UserName))
                .ForMember(dto => dto.CinsiyetNo, islem => islem.ResolveUsing(e => e.Kisi.CinsiyetNo))
                .ForMember(dto => dto.ProfilFotoUrl, islem => islem.ResolveUsing(e => e.AsilFotografUrlGetir()))
                .ForMember(dto => dto.PersonelNo, islem => islem.ResolveUsing(e =>
                     (e.Kisi != null && e.Kisi.Personellikleri != null && e.Kisi.Personellikleri.Count == 1) ? e.Kisi.Personellikleri.First().PersonelId : 0));

            CreateMap<Kullanici, KullaniciDetayDto>()
               .ForMember(dto => dto.CinsiyetAdi, islem => islem.ResolveUsing(e => e.Kisi.Cinsiyeti.CinsiyetAdi))
               .ForMember(dto => dto.KullaniciAdi, islem => islem.ResolveUsing(e => e.UserName))
               .ForMember(dto => dto.Eposta, islem => islem.ResolveUsing(e => e.Email))
               .ForMember(dto => dto.EpostaOnaylandi, islem => islem.ResolveUsing(e => e.EmailConfirmed))
               .ForMember(dto => dto.TelefonNumarasi, islem => islem.ResolveUsing(e => e.PhoneNumber))
               .ForMember(dto => dto.TelefonOnaylandi, islem => islem.ResolveUsing(e => e.PhoneNumberConfirmed))
               .ForMember(dto => dto.YaratilmaTarihi, islem => islem.ResolveUsing(e => e.YaratilmaTarihi))
               .ForMember(dto => dto.SonAktifOlma, islem => islem.ResolveUsing(e => e.SonAktifOlmaTarihi))
               .ForMember(dto => dto.Yasi, islem => islem.ResolveUsing(e => e.Kisi.DogumTarihi.YasHesapla()))
               .ForMember(dto => dto.TamAdi, islem => islem.ResolveUsing(e => e.TamAdOlustur()))
               .ForMember(dto => dto.ProfilFotoUrl, islem => islem.ResolveUsing(e => e.AsilFotografUrlGetir()))
               .ForMember(dto => dto.Fotograflari, islem => islem.Ignore())
               .AfterMap((e, d) =>
               {
                   if (e.Kisi != null && e.Kisi.Fotograflari != null)
                   {
                       
                       foreach (var ftr in e.Kisi.Fotograflari)
                       {
                           var yeniFoto = Mapper.Map<FotoDetayDto>(ftr);
                           d.Fotograflari.Add(yeniFoto);

                       }
                   }

               });



            CreateMap<Foto, FotoDetayDto>();
            CreateMap<Foto, FotoOkuDto>();
            CreateMap<Cinsiyet, CinsiyetDto>();

        }



        private void CreateResourceToEntityMap()
        {


            CreateMap<FotoDetayDto, Foto>().ForMember(k => k.FotoId, islem => islem.Ignore());
            CreateMap<FotografYazDto, Foto>();


            CreateMap<UyelikYaratDto, Kullanici>()
                .ForPath(d => d.Kisi.Unvan, opt => opt.MapFrom(s => s.Unvan))
                .ForPath(d => d.Kisi.Ad, opt => opt.MapFrom(s => s.Ad))
                .ForPath(d => d.Kisi.DigerAd, opt => opt.MapFrom(s => s.DigerAd))
                .ForPath(d => d.Kisi.Soyad, opt => opt.MapFrom(s => s.Soyad))
                .ForPath(d => d.Kisi.CinsiyetNo, opt => opt.MapFrom(s => s.CinsiyetNo))
                .ForPath(d => d.Email, opt => opt.MapFrom(s => s.EPosta))
                .ForPath(d => d.UserName, opt => opt.MapFrom(s => s.KullaniciAdi))
                .ForPath(d => d.Kisi.DogumTarihi, opt => opt.MapFrom(s => s.DogumTarihi))
                .AfterMap((dto, entity) =>
                {
                    entity.YaratilmaTarihi = DateTime.Now;
                    entity.Pasif = true;
                    entity.Yonetici = false;
                });

            CreateMap<ProfilYazDto, Kullanici>()
                .ForPath(d => d.Kisi.Unvan, opt => opt.MapFrom(s => s.Unvan))
                .ForPath(d => d.Kisi.Ad, opt => opt.MapFrom(s => s.Ad))
                .ForPath(d => d.Kisi.DigerAd, opt => opt.MapFrom(s => s.DigerAd))
                .ForPath(d => d.Kisi.Soyad, opt => opt.MapFrom(s => s.Soyad))
                .ForPath(d => d.Kisi.CinsiyetNo, opt => opt.MapFrom(s => s.CinsiyetNo))
                .ForPath(d => d.Kisi.DogumTarihi, opt => opt.MapFrom(s => s.DogumTarihi));

        }
    }
}
