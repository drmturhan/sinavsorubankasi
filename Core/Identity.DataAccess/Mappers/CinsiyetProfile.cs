using AutoMapper;
using Core.EntityFramework.SharedEntity;
using Identity.DataAccess.Dtos;

namespace Identity.DataAccess.Mappers
{
    public class CinsiyetProfile : Profile {

        public CinsiyetProfile()
        {

            CreateEntityToResourceMap();
            CreateResourceToEntityMap();
        }

        private void CreateEntityToResourceMap()
        {
            CreateMap<Cinsiyet, CinsiyetDto>();
            CreateMap<KisiCinsiyet, CinsiyetDto>();
        }

        private void CreateResourceToEntityMap()
        {
            CreateMap<CinsiyetDto, KisiCinsiyet>();
        }
    }
}
