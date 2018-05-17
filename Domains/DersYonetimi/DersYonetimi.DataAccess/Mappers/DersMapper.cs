using AutoMapper;
using DersYonetimi.DataAccess.Dtos;
using DersYonetimi.DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace DersYonetimi.DataAccess.Mappers
{
   
    public static class DersMapper
    {
        internal static IMapper Mapper { get; }
        static DersMapper()
        {
            Mapper = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<DersProfile>();
            }).CreateMapper();
        }

        public static Ders ToSoru(this DersDto dto)

        {
            return dto == null ? null : Mapper.Map<Ders>(dto);
        }
    }
    }
