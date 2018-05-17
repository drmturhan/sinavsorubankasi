using AutoMapper;
using SoruDeposu.DataAccess.Dtos;
using SoruDeposu.DataAccess.Entities;

namespace SoruDeposu.DataAccess.Mappers
{
    public class DersAnlatanHocaProfile : Profile
    {

        public DersAnlatanHocaProfile()
        {
            CreateEntityToResourceMap();
            CreateResourceToEntityMap();
        }
        private void CreateEntityToResourceMap()
        {

            CreateMap<Birim, SoruBirimDto>();
            CreateMap<Program, SoruProgramDto>();
            CreateMap<Donem, ProgramDonemDto>();
            CreateMap<DersGrup, DersGrupDto>()
                .ForMember(d => d.Dersleri, islem => islem.Ignore())
                .AfterMap((e, d) =>
                {
                    foreach (var grupDersi in e.Dersleri)
                    {

                        d.Dersleri.Add(grupDersi.Dersi.ToDersDto());
                    }

                });

            CreateMap<Ders, DersDto>();
            CreateMap<Konu, KonuDto>();
            CreateMap<OgrenimHedef, OgrenimHedefDto>();
            CreateMap<DersHoca, HocaDto>()
                .ForMember(d => d.UnvanAdSoyad, islem =>
                islem.ResolveUsing(e => e.PersonelBilgisi != null && e.PersonelBilgisi.KisiBilgisi != null ?
                $"{e.PersonelBilgisi.KisiBilgisi.Unvan} {e.PersonelBilgisi.KisiBilgisi.Ad} {e.PersonelBilgisi.KisiBilgisi.Soyad}" : ""));


        }
        private void CreateResourceToEntityMap()
        {

        }


    }
}
