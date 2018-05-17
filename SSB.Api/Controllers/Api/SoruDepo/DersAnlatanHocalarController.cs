using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Identity.DataAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Psg.Api.Base;
using SoruDeposu.DataAccess;
using SoruDeposu.DataAccess.Helpers;

namespace Psg.Api.Controllers.Api.SoruDepo
{
    [Produces("application/json")]
    [Route("api/DersAnlatanHocalar")]
    [AllowAnonymous]
    public class DersAnlatanHocalarController : MTSController
    {
        private readonly IDersAnlatanHocaStore dahStore;
        private readonly KullaniciYonetici userManager;

        public DersAnlatanHocalarController(IDersAnlatanHocaStore dahStore, KullaniciYonetici userManager)
        {
            this.dahStore = dahStore;
            this.userManager = userManager;
        }




        [HttpGet(Name = "DersAnlatanHocayiGetir")]
        [Route("kullanicininanlattigiderslervekonular")]
        public async Task<IActionResult> Get()
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {
                int personelNo = await userManager.PersonelNumarasiniAlAsync(aktifKullaniciNo);
                if (personelNo <= 0) throw new Exception("Kullanici yok!");
                var liste = dahStore.ListeGetirPersonelNoyaGore(personelNo);
                BirimAgaciFactory factory = new BirimAgaciFactory(liste, personelNo);
                var sonuc = factory.Yarat();
                return Ok(sonuc);
            });
        }
    }
}