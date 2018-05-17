using AutoMapper;
using Identity.DataAccess.Dtos;

namespace Identity.DataAccess.Mappers
{
    public class MesajProfile : Profile
    {
        public MesajProfile()
        {
            CreateEntityToResourceMap();
            CreateResourceToEntityMap();
        }

        private void CreateEntityToResourceMap()
        {
            CreateMap<Mesaj, MesajListeDto>()
                .ForMember(dto => dto.GonderenTamAdi, isl => isl.ResolveUsing(ent => ent.Gonderen.TamAdOlustur()))
                .ForMember(dto => dto.GonderenProfilFotoUrl, isl => isl.ResolveUsing(ent => ent.Gonderen.AsilFotografUrlGetir()))
                .ForMember(dto => dto.AlanTamAdi, isl => isl.ResolveUsing(ent => ent.Alan.TamAdOlustur()))
                .ForMember(dto => dto.AlanProfilFotoUrl, isl => isl.ResolveUsing(ent => ent.Alan.AsilFotografUrlGetir()));


        }

        private void CreateResourceToEntityMap()
        {
            CreateMap<MesajYaratmaDto, Mesaj>();
            
        }
    }
}
