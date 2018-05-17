using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.EntityFramework;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Psg.Api.Base;
using SoruDeposu.DataAccess;
using SoruDeposu.DataAccess.Dtos;
using SoruDeposu.DataAccess.Entities;
using SoruDeposu.DataAccess.Mappers;

namespace Psg.Api.Controllers.Api.SoruDepo
{
    [Produces("application/json")]
    [Route("api/BilisselDuzeyler")]
    public class BilisselDuzeylerController : MTSController
    {
        private readonly IBilisselDuzeyStore store;
        private readonly IUrlHelper urlHelper;

        public BilisselDuzeylerController(IBilisselDuzeyStore store, IUrlHelper urlHelper)
        {
            this.store = store;
            this.urlHelper = urlHelper;
        }

        [HttpGet(Name = "bilisselduzeyler")]
        public async Task<IActionResult> Get(BilisselDuzeySorgusu sorguNesnesi)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {
                var kayitlar = await store.ListeGetirBilisselDuzeylerAsync(sorguNesnesi);
                var sby = new StandartSayfaBilgiYaratici(sorguNesnesi, "Sorutipleri", urlHelper);
                Response.Headers.Add("X-Pagination", kayitlar.SayfalamaMetaDataYarat<BilisselDuzey>(sby));

                var sonuc = ListeSonuc<BilisselDuzeyDto>.IslemTamam(kayitlar.ToDto());
                return Ok(sonuc.ShapeData(sorguNesnesi.Alanlar));
            });
        }
    }
}