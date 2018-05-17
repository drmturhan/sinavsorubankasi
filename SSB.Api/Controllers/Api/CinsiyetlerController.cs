using System.Threading.Tasks;
using AutoMapper;
using Identity.DataAccess.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Psg.Api.Base;
using Psg.Api.Dtos;
using Psg.Api.Repos;
using Identity.DataAccess.Mappers;
using Microsoft.AspNetCore.Authorization;
using Core.EntityFramework;
using Identity.DataAccess;
using Identity.DataAccess.Dtos;

namespace Psg.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/cinsiyetler")]
    
    public class CinsiyetlerController : MTSController
    {
        private readonly ICinsiyetRepository repo;
        private readonly IUrlHelper urlHelper;

        public CinsiyetlerController(ICinsiyetRepository repo, IUrlHelper urlHelper) 
        {
            this.repo = repo;
            this.urlHelper = urlHelper;
        }
        [HttpGet()]
        [AllowAnonymous]
        public async Task<IActionResult> Get(CinsiyetSorgu sorgu)
        {


            return await HataKontrolluDondur<Task<IActionResult>>(async () =>
            {
                var kayitlar = await repo.ListeGetirCinsiyetAsync(sorgu);
                var sby = new StandartSayfaBilgiYaratici(sorgu, "Kullanicilar", urlHelper);

                Response.Headers.Add("X-Pagination", kayitlar.SayfalamaMetaDataYarat<KisiCinsiyet>(sby));

                var sonuc = ListeSonuc<KisiCinsiyet>.IslemTamam(kayitlar);

                ListeSonuc<CinsiyetDto> donecekListe = sonuc.ToDto();
                return Ok(donecekListe.ShapeData(sorgu.Alanlar));
            });

            
        }

    }
}