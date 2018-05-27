using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Base.Hatalar;
using Core.EntityFramework;
using Identity.DataAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Psg.Api.Base;
using SoruDeposu.DataAccess;
using SoruDeposu.DataAccess.Dtos;
using SoruDeposu.DataAccess.Entities;
using SoruDeposu.DataAccess.Mappers;

namespace SSB.Api.Controllers.Api.SoruDepo
{
    [Produces("application/json")]
    [Route("api/SoruKokleri")]
    public class SoruKokleriController : MTSController
    {

        private readonly ISoruKokuStore soruKokuStore;
        private readonly IUrlHelper urlHelper;
        private readonly KullaniciYonetici kullaniciYonetici;

        public SoruKokleriController(ISoruKokuStore soruStore, IUrlHelper urlHelper, KullaniciYonetici kullaniciYonetici)
        {
            this.soruKokuStore = soruStore;
            this.urlHelper = urlHelper;
            this.kullaniciYonetici = kullaniciYonetici;
        }

        [HttpGet(Name = "sorukokleri")]
        public async Task<IActionResult> Get(SoruKokuSorgu sorgu)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {
                var kayitlar = await soruKokuStore.ListeGetirAsync(sorgu);
                var sby = new StandartSayfaBilgiYaratici(sorgu, "Sorular", urlHelper);
                Response.Headers.Add("X-Pagination", kayitlar.SayfalamaMetaDataYarat<SoruKoku>(sby));

                var sonuc = ListeSonuc<SoruKokuListeDto>.IslemTamam(kayitlar.ToListeDto());

                return Ok(sonuc.ShapeData(sorgu.Alanlar));
            });
        }

        [HttpGet("{id}", Name = "SoruKokuListeOku")]
        public async Task<IActionResult> Get(int id, [FromQuery] SoruKokuSorgu sorgu)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {
                var soruKoku = await soruKokuStore.BulAsync(id);
                if (soruKoku == null)
                    return NotFound("Soru kökü bulunamadı");

                var sonuc = KayitSonuc<SoruKokuListeDto>.IslemTamam(soruKoku.ToDto());
                return Ok(sonuc.ShapeData(sorgu.Alanlar));
            });
        }

        [HttpGet("sorukokual/{id}")]
        public async Task<IActionResult> GetSoruById(int id)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {

                var soruKoku = await soruKokuStore.BulAsync(id);
                if (soruKoku == null)
                    return NotFound("Soru kökü bulunamadı");
                var sonuc = KayitSonuc<SoruKokuDegistirDto>.IslemTamam(soruKoku.ToDegistirDto());
                return Ok(sonuc);
            });
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> YeniSoruKoku([FromBody] SoruKokuYaratDto yeniDto)
        {

            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {

                var soruKoku = await soruKokuStore.YaratAsync(yeniDto);
                try
                {
                    var sonuc = await soruKokuStore.KaydetAsync();
                    if (sonuc)
                    {
                        var dbSoru = await soruKokuStore.BulAsync(soruKoku.SoruKokuId);
                        //return CreatedAtRoute("SoruListeOku", new { id = soru.SoruId }, soru);
                        var kayitSonuc = KayitSonuc<SoruKokuListeDto>.IslemTamam(dbSoru.ToListeDto());
                        return Ok(kayitSonuc);
                    }
                }
                catch (Exception e)
                {
                    throw new InternalServerError("Soru kökü yaratılamadı!");
                }
                throw new InternalServerError("Soru kökü yaratılamadı!");
            });
        }

        [AllowAnonymous]
        [HttpPut]
        public async Task<IActionResult> SoruKokuKaydet([FromBody] SoruKokuDegistirDto degisecekSoru)
        {

            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {

                var kullanici = await kullaniciYonetici.FindByIdAsync("1");
                if (kullanici == null || !kullanici.EmailConfirmed || kullanici.Pasif)
                    throw new BadRequestError("Kullanıcı bilgisi yanlış");

                var veritabanindakiKayit = await soruKokuStore.DegistirAsync(degisecekSoru);
                var sonuc = await soruKokuStore.KaydetAsync();
                if (sonuc)
                {
                    var kayitSonuc = KayitSonuc<SoruKokuListeDto>.IslemTamam(veritabanindakiKayit.ToListeDto());

                    return Ok(kayitSonuc);
                }
                throw new InternalServerError("Soru kökü yaratılamadı!");
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Sil(int id)
        {
            //Tamamen silme yok! Silindi olarak işaretleniyor.

            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {

                var dbdekiKayit = await soruKokuStore.BulAsync(id);
                if (dbdekiKayit == null)
                    return NotFound("Soru kökü bulunamadı!");



                //soruStore.Sil(dbdekiKayit);
                SoruKokuAlanDegistirDto silmeBilgisi = new SoruKokuAlanDegistirDto();
                silmeBilgisi.SoruNo = id;
                silmeBilgisi.Silindi = true;
                var veritabanindakiKayit = await soruKokuStore.KismenDegistirAsync(silmeBilgisi);
                var sonuc = await soruKokuStore.KaydetAsync();
                if (sonuc)
                {
                    var donecekSonuc = Sonuc.Tamam;

                    return Ok(donecekSonuc);
                }
                throw new InternalServerError("Sorukökü silinemedi!");
            });

        }
    }
}
