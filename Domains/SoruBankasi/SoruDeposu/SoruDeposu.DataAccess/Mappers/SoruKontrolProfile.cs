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
            CreateMap<KontrolListeGrupTanim, SoruKontrolBelgeDto>()
                .ForMember(d => d.Kontroller, islem => islem.Ignore())
                .AfterMap((e, d) =>
                {

                    foreach (var item in e.Listeleri)
                    {
                        SoruKontrolItemDto yeni = CreateFormItem(item);

                        d.Kontroller.Add(yeni);
                    }
                });




            CreateMap<KontrolListeTanim, SoruKontrolItemDto>()
                .ForMember(d => d.Degerleri, islem => islem.Ignore())
                .AfterMap((e, d) =>
                {
                    foreach (var item in e.DegerGrubu.DegerListesi)
                    {
                        SoruKontrolItemDetayDto yeni = CreateFromDegerGrubu(item);
                        d.Degerleri.Add(yeni);

                    }

                });

            CreateMap<Entities.KontrolDegerTanim, SoruKontrolItemDetayDto>();


        }

        private SoruKontrolItemDetayDto CreateFromDegerGrubu(Entities.KontrolDegerTanim item)
        {
            return Mapper.Map<SoruKontrolItemDetayDto>(item);
        }

        private SoruKontrolItemDto CreateFormItem(KontrolListeTanim item)
        {
            return Mapper.Map<SoruKontrolItemDto>(item);
        }

        private void CreateResourceToEntityMap()
        {

        }
    }
}
