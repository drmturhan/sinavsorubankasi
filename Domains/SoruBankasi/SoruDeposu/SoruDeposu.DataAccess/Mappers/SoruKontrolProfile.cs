using AutoMapper;
using SoruDeposu.DataAccess.Dtos;
using SoruDeposu.DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SoruDeposu.DataAccess.Mappers
{
    public class SoruKontrolProfile : Profile
    {
        public SoruKontrolProfile()
        {

            CreateEntityToResourceMap();
            CreateResourceToEntityMap();
        }

        private void CreateEntityToResourceMap()
        {
            CreateMap<KontrolListesiGrupTanim, SoruKontrolBelgeDto>()
                .ForMember(d => d.Kontroller, islem => islem.Ignore())
                .AfterMap((e, d) =>
                {

                    foreach (var item in e.Listeleri)
                    {
                        SoruKontrolItemDto yeni = CreateFormItem(item);

                        d.Kontroller.Add(yeni);
                    }
                });




            CreateMap<KontrolListesiMaddeTanim, SoruKontrolItemDto>()
                .ForMember(d => d.Degerleri, islem => islem.Ignore())
                .AfterMap((e, d) =>
                {
                    foreach (var item in e.DegerGrubu.DegerListesi)
                    {
                        SoruKontrolItemDetayDto yeni = CreateFromDegerGrubu(item);
                        d.Degerleri.Add(yeni);

                    }

                });

            CreateMap<Entities.KontrolListesiDegerTanim, SoruKontrolItemDetayDto>();


        }

        private SoruKontrolItemDetayDto CreateFromDegerGrubu(Entities.KontrolListesiDegerTanim item)
        {
            return Mapper.Map<SoruKontrolItemDetayDto>(item);
        }

        private SoruKontrolItemDto CreateFormItem(KontrolListesiMaddeTanim item)
        {
            return Mapper.Map<SoruKontrolItemDto>(item);
        }

        private void CreateResourceToEntityMap()
        {

        }
    }
}
