using AutoMapper;
using Core.EntityFramework;
using Core.EntityFramework.SharedEntity;
using Identity.DataAccess.Dtos;
using System.Collections.Generic;

namespace Identity.DataAccess.Mappers
{
    public static class KullaniciMappers
    {
        internal static IMapper Mapper { get; }
        static KullaniciMappers()
        {
            Mapper = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<KullaniciProfile>();
                cfg.AddProfile<CinsiyetProfile>();
            }).CreateMapper();
        }

        public static KullaniciDetayDto ToKullaniciDetayDto(this Kullanici entity)

        {
            return entity == null ? null : Mapper.Map<KullaniciDetayDto>(entity);
        }
        public static ProfilOku ToProfilOkuDto(this Kullanici entity)

        {
            return entity == null ? null : Mapper.Map<ProfilOku>(entity);
        }
        public static ProfilYazDto ToDto(this Kullanici entity)

        {
            return entity == null ? null : Mapper.Map<ProfilYazDto>(entity);
        }

        public static Kullanici ToEntity(this KullaniciDetayDto resource)

        {
            return resource == null ? null : Mapper.Map<Kullanici>(resource);
        }

        public static Kullanici ToEntity(this ProfilYazDto resource)

        {
            return resource == null ? null : Mapper.Map<Kullanici>(resource);
        }
        public static Kullanici ToEntity(this KullaniciBilgi resource)

        {
            return resource == null ? null : Mapper.Map<Kullanici>(resource);
        }
        public static KullaniciBilgi ToKullaniciBilgi(this Kullanici resource)

        {
            return resource == null ? null : Mapper.Map<KullaniciBilgi>(resource);
        }
        public static Kullanici ToEntity(this UyelikYaratDto resource)

        {
            return resource == null ? null : Mapper.Map<Kullanici>(resource);
        }
        public static ListeSonuc<KullaniciListeDto> ToKullaniciDetayDto(this ListeSonuc<Kullanici> entitySonuc)
        {
            return entitySonuc == null ? null : Mapper.Map<ListeSonuc<KullaniciListeDto>>(entitySonuc);
        }


        public static ListeSonuc<CinsiyetDto> ToDto(this ListeSonuc<KisiCinsiyet> entitySonuc)
        {
            return entitySonuc == null ? null : Mapper.Map<ListeSonuc<CinsiyetDto>>(entitySonuc);
        }
        public static ListeSonuc<Kullanici> ToEntity(this ListeSonuc<KullaniciListeDto> entitySonuc)
        {
            return entitySonuc == null ? null : Mapper.Map<ListeSonuc<Kullanici>>(entitySonuc);
        }
        public static void Kopyala(ProfilYazDto yazDto, Kullanici entity)
        {
            Mapper.Map(yazDto, entity);
        }
    }


    public static class ArkadaslikTeklifMappers
    {
        internal static IMapper Mapper { get; }
        static ArkadaslikTeklifMappers()
        {
            Mapper = new MapperConfiguration(cfg => cfg.AddProfile<ArkadaslikTeklifProfile>()).CreateMapper();
        }

        public static ArkadaslarimListeDto ToDto(this ArkadaslikTeklif entity)
        {
            return entity == null ? null : Mapper.Map<ArkadaslarimListeDto>(entity);
        }


        public static ListeSonuc<ArkadaslarimListeDto> ToDto(this ListeSonuc<ArkadaslikTeklif> entitySonuc)
        {
            return entitySonuc == null ? null : Mapper.Map<ListeSonuc<ArkadaslarimListeDto>>(entitySonuc);
        }
        public static ListeSonuc<ArkadaslikTeklif> ToEntity(this ListeSonuc<ArkadaslarimListeDto> dtoSonuc)
        {
            return dtoSonuc == null ? null : Mapper.Map<ListeSonuc<ArkadaslikTeklif>>(dtoSonuc);
        }
    }
    public static class KisiFotoMappers
    {
        internal static IMapper Mapper { get; }
        static KisiFotoMappers()
        {
            Mapper = new MapperConfiguration(cfg => cfg.AddProfile<FotoProfile>()).CreateMapper();
        }

        public static FotoOkuDto ToFotoOkuDto(this KisiFoto entity)
        {
            return entity == null ? null : Mapper.Map<FotoOkuDto>(entity);
        }
        public static FotoDetayDto ToFotoDetayDto(this KisiFoto entity)
        {
            return entity == null ? null : Mapper.Map<FotoDetayDto>(entity);
        }

        public static KisiFoto ToEntity(this FotografYazDto dto)
        {
            return dto == null ? null : Mapper.Map<KisiFoto>(dto);
        }

    }
    public static class MesajMappers
    {
        internal static IMapper Mapper { get; }
        static MesajMappers()
        {
            Mapper = new MapperConfiguration(cfg => cfg.AddProfile<MesajProfile>()).CreateMapper();
        }
        public static Mesaj ToEntity(this MesajYaratmaDto dto)
        {
            return dto == null ? null : Mapper.Map<Mesaj>(dto);
        }
        public static MesajListeDto ToListeDto(this Mesaj entity)
        {
            return entity == null ? null : Mapper.Map<MesajListeDto>(entity);
        }
        public static ListeSonuc<MesajListeDto> ToMesajListeDto(this ListeSonuc<Mesaj> entitySonuc)
        {
            return entitySonuc == null ? null : Mapper.Map<ListeSonuc<MesajListeDto>>(entitySonuc);
        }
    }

    public static class CinsiyetMappers
    {
        internal static IMapper Mapper { get; }
        static CinsiyetMappers()
        {
            Mapper = new MapperConfiguration(cfg => cfg.AddProfile<CinsiyetProfile>()).CreateMapper();
        }
        public static Cinsiyet ToEntity(this CinsiyetDto dto)
        {

            return dto == null ? null : Mapper.Map<Cinsiyet>(dto);
        }
        public static CinsiyetDto ToDto(this Cinsiyet entityList)
        {

            return entityList == null ? null : Mapper.Map<CinsiyetDto>(entityList);
        }
        public static IEnumerable<Cinsiyet> ToEntity(this IEnumerable<CinsiyetDto> dtoListe)
        {

            return dtoListe == null ? null : Mapper.Map<IEnumerable<Cinsiyet>>(dtoListe);
        }
        public static IEnumerable<CinsiyetDto> ToDto(this IEnumerable<Cinsiyet> entityList)
        {

            return entityList == null ? null : Mapper.Map<IEnumerable<CinsiyetDto>>(entityList);
        }


        public static KisiCinsiyet ToKisiCinsiyet(this CinsiyetDto dto)
        {

            return dto == null ? null : Mapper.Map<KisiCinsiyet>(dto);
        }
        public static CinsiyetDto ToDto(this KisiCinsiyet entityList)
        {

            return entityList == null ? null : Mapper.Map<CinsiyetDto>(entityList);
        }
        public static IEnumerable<KisiCinsiyet> ToKisiCinsiyet(this IEnumerable<CinsiyetDto> dtoListe)
        {

            return dtoListe == null ? null : Mapper.Map<IEnumerable<KisiCinsiyet>>(dtoListe);
        }
        public static IEnumerable<CinsiyetDto> ToDto(this IEnumerable<KisiCinsiyet> entityList)
        {

            return entityList == null ? null : Mapper.Map<IEnumerable<CinsiyetDto>>(entityList);
        }
    }
}
