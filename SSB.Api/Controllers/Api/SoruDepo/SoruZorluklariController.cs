using System.Threading.Tasks;
using Core.EntityFramework;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Psg.Api.Base;
using SoruDeposu.DataAccess;
using SoruDeposu.DataAccess.Dtos;
using SoruDeposu.DataAccess.Entities;
using SoruDeposu.DataAccess.Mappers;

namespace Psg.Api.Controllers.Api.SoruDepo
{
    [Produces("application/json")]
    [Route("api/SoruZorluklari")]
    [AllowAnonymous]
    public class SoruZorluklariController : MTSController
    {
        private readonly ISoruZorlukStore store;
        private readonly IUrlHelper urlHelper;

        public SoruZorluklariController(ISoruZorlukStore store, IUrlHelper urlHelper)
        {
            this.store = store;
            this.urlHelper = urlHelper;
        }

        [HttpGet(Name = "SoruZorluklari")]
        public async Task<IActionResult> Get(SoruZorlukSorgusu sorguNesnesi)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {
                var kayitlar = await store.ListeGetirSoruZorluklariAsync(sorguNesnesi);
                var sby = new StandartSayfaBilgiYaratici(sorguNesnesi, "SoruZorlukleri", urlHelper);
                Response.Headers.Add("X-Pagination", kayitlar.SayfalamaMetaDataYarat<SoruZorluk>(sby));

                var sonuc = ListeSonuc<SoruZorlukDto>.IslemTamam(kayitlar.ToDto());
                return Ok(sonuc.ShapeData(sorguNesnesi.Alanlar));
            });

        }

    }
}