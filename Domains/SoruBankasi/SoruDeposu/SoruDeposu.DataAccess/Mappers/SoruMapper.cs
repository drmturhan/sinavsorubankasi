using AutoMapper;
using Core.EntityFramework;
using SoruDeposu.DataAccess.Dtos;
using SoruDeposu.DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SoruDeposu.DataAccess.Mappers
{
    public static class SoruMapper
    {
        internal static IMapper Mapper { get; }
        static SoruMapper()
        {
            Mapper = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<SoruProfile>();
                cfg.AddProfile<DersAnlatanHocaProfile>();
                cfg.AddProfile<SoruKontrolProfile>();
            }).CreateMapper();
        }

        public static Soru ToSoru(this SoruYaratDto dto)

        {
            return dto == null ? null : Mapper.Map<Soru>(dto);
        }

        public static SoruKoku ToSoruKoku(this SoruKokuYaratDto dto)

        {
            return dto == null ? null : Mapper.Map<SoruKoku>(dto);
        }

        public static void Yaz(this SoruYaratDto dto, Soru entity)

        {
            Mapper.Map(dto, entity);
        }

        public static void Yaz(this SoruDegistirDto dto, Soru entity)
        {
            Mapper.Map(dto, entity);
        }
        public static void Yaz(this SoruKokuDegistirDto dto, SoruKoku entity)
        {
            Mapper.Map(dto, entity);
        }
        public static Soru ToSoru(this SoruDegistirDto dto)

        {
            return dto == null ? null : Mapper.Map<Soru>(dto);
        }


        public static TekDogruluSoruSecenek ToEntity(this TekDogruluSoruSecenekDto dto)

        {
            return dto == null ? null : Mapper.Map<TekDogruluSoruSecenek>(dto);
        }

        public static TekDogruluSoruSecenek Kopyala(this TekDogruluSoruSecenekDto dto, TekDogruluSoruSecenek e)

        {
            return dto == null ? null : Mapper.Map(dto, e);
        }


        public static TekDogruluSoruSecenekDto ToDto(this TekDogruluSoruSecenek entity)

        {
            return entity == null ? null : Mapper.Map<TekDogruluSoruSecenekDto>(entity);
        }


        public static SoruDegistirDto ToSoruDegistirDto(this Soru entity)

        {
            return entity == null ? null : Mapper.Map<SoruDegistirDto>(entity);
        }

        public static SoruListeDto ToSoruListeDto(this Soru entity)

        {
            return entity == null ? null : Mapper.Map<SoruListeDto>(entity);
        }
        public static SoruKokuListeDto ToListeDto(this SoruKoku entity)

        {
            return entity == null ? null : Mapper.Map<SoruKokuListeDto>(entity);
        }


        public static SoruBirimDto ToSoruBirimDto(this Birim entity)

        {
            return entity == null ? null : Mapper.Map<SoruBirimDto>(entity);
        }

        public static DersDto ToDersDto(this Ders entity)

        {
            return entity == null ? null : Mapper.Map<DersDto>(entity);
        }

        public static DersDto ToDersDto(this GrupDers entity)

        {
            return entity == null ? null : Mapper.Map<DersDto>(entity);
        }

        public static OgrenimHedefDto ToDto(this OgrenimHedef entity)

        {
            return entity == null ? null : Mapper.Map<OgrenimHedefDto>(entity);
        }


        public static SayfaliListe<SoruListeDto> ToListeDto(this SayfaliListe<Soru> entitySonuc)
        {
            return entitySonuc == null ? null : Mapper.Map<SayfaliListe<SoruListeDto>>(entitySonuc);
        }

        public static SayfaliListe<SoruKokuListeDto> ToListeDto(this SayfaliListe<SoruKoku> entitySonuc)
        {
            return entitySonuc == null ? null : Mapper.Map<SayfaliListe<SoruKokuListeDto>>(entitySonuc);
        }
        public static SoruKokuListeDto ToDto(this SoruKoku entity)
        {
            return entity == null ? null : Mapper.Map<SoruKokuListeDto>(entity);
        }

        public static SoruKokuDegistirDto ToDegistirDto(this SoruKoku entity)
        {
            return entity == null ? null : Mapper.Map<SoruKokuDegistirDto>(entity);
        }


        public static SayfaliListe<SoruTipDto> ToDto(this SayfaliListe<SoruTip> entitySonuc)
        {
            return entitySonuc == null ? null : Mapper.Map<SayfaliListe<SoruTipDto>>(entitySonuc);
        }


        public static SayfaliListe<SoruZorlukDto> ToDto(this SayfaliListe<SoruZorluk> entitySonuc)
        {
            return entitySonuc == null ? null : Mapper.Map<SayfaliListe<SoruZorlukDto>>(entitySonuc);
        }


        public static SoruTipDto ToDto(this SoruTip entity)
        {

            return entity == null ? null : Mapper.Map<SoruTipDto>(entity);
        }


        public static SayfaliListe<BilisselDuzeyDto> ToDto(this SayfaliListe<BilisselDuzey> entitySonuc)
        {
            return entitySonuc == null ? null : Mapper.Map<SayfaliListe<BilisselDuzeyDto>>(entitySonuc);
        }

        public static BilisselDuzeyDto ToDto(this BilisselDuzey entity)
        {

            return entity == null ? null : Mapper.Map<BilisselDuzeyDto>(entity);
        }

        public static SoruKontrolBelgeDto ToKontrolBelgeDto(this KontrolListesiGrupTanim entity)
        {

            return entity == null ? null : Mapper.Map<SoruKontrolBelgeDto>(entity);
        }
    }
}
