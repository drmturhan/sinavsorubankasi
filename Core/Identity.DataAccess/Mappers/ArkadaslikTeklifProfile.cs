using System;
using AutoMapper;
using Core.Base.Helpers;
using Identity.DataAccess.Dtos;

namespace Identity.DataAccess.Mappers
{
    public class ArkadaslikTeklifProfile : Profile
    {
        public ArkadaslikTeklifProfile()
        {
            CreateEntityToResourceMap();
            CreateResourceToEntityMap();
        }

        private void CreateEntityToResourceMap()
        {
            CreateMap<ArkadaslikTeklif, ArkadaslarimListeDto>()
                .ForMember(dto => dto.Id, islem => islem.ResolveUsing(e => $"{e.TeklifEdenNo}-{e.TeklifEdilenNo}"));
            CreateMap<Kullanici, ArkadasDto>()                
                .ForMember(dto => dto.CinsiyetAdi, islem => islem.ResolveUsing(e => e.Kisi.Cinsiyeti.CinsiyetAdi))
                .ForMember(dto => dto.Eposta, islem => islem.ResolveUsing(e => e.Email))
                .ForMember(dto => dto.EpostaOnaylandi, islem => islem.ResolveUsing(e => e.EmailConfirmed))
                .ForMember(dto => dto.TelefonNumarasi, islem => islem.ResolveUsing(e => e.PhoneNumber))
                .ForMember(dto => dto.TelefonOnaylandi, islem => islem.ResolveUsing(e => e.PhoneNumberConfirmed))
                .ForMember(dto => dto.Yasi, islem => islem.ResolveUsing(e => e.Kisi.DogumTarihi.YasHesapla()))
                .ForMember(dto => dto.TamAdi, islem => islem.ResolveUsing(e => e.TamAdOlustur()))
                .ForMember(dto => dto.ProfilFotoUrl, islem => islem.ResolveUsing(e => e.AsilFotografUrlGetir()));

        }

        private void CreateResourceToEntityMap()
        {

        }
    }
}
