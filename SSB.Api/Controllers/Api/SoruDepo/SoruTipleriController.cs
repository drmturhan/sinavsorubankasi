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
    [Route("api/SoruTipleri")]
    [AllowAnonymous]
    public class SoruTipleriController : MTSController
    {
        private readonly ISoruTipStore store;
        private readonly IUrlHelper urlHelper;

        public SoruTipleriController(ISoruTipStore store, IUrlHelper urlHelper)
        {
            this.store = store;
            this.urlHelper = urlHelper;
        }

        [HttpGet(Name = "sorutipleri")]
        public async Task<IActionResult> Get(SoruTipSorgusu sorguNesnesi)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {

                var kayitlar = await store.ListeGetirSoruTipleriAsync(sorguNesnesi);
                var sby = new StandartSayfaBilgiYaratici(sorguNesnesi, "Sorutipleri", urlHelper);
                Response.Headers.Add("X-Pagination", kayitlar.SayfalamaMetaDataYarat<SoruTip>(sby));

                var sonuc = ListeSonuc<SoruTipDto>.IslemTamam(kayitlar.ToDto());
                return Ok(sonuc.ShapeData(sorguNesnesi.Alanlar));
            });

        }

    }
}