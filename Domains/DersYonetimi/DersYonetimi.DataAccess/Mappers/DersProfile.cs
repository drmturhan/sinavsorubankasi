using AutoMapper;
using DersYonetimi.DataAccess.Dtos;
using DersYonetimi.DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace DersYonetimi.DataAccess.Mappers
{
   
     public class DersProfile : Profile
    {
        public DersProfile()
        {

            CreateEntityToResourceMap();
            CreateResourceToEntityMap();
        }

        private void CreateEntityToResourceMap()
        {

            CreateMap<Ders, DersDto>();
            
        }

        private void CreateResourceToEntityMap()
        {
            CreateMap<DersDto,Ders>();
        }
    }
}
