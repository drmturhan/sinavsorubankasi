using System;
using System.Threading.Tasks;
using Core.Base.Hatalar;
using Core.EntityFramework;
using Identity.DataAccess;
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
    [Route("api/Sorular")]
    [AllowAnonymous]
    public class SorularController : MTSController
    {
        private readonly ISoruStore soruStore;
        private readonly IUrlHelper urlHelper;
        private readonly KullaniciYonetici kullaniciYonetici;

        public SorularController(ISoruStore soruStore, IUrlHelper urlHelper, KullaniciYonetici kullaniciYonetici)
        {
            this.soruStore = soruStore;
            this.urlHelper = urlHelper;
            this.kullaniciYonetici = kullaniciYonetici;
        }

        [HttpGet(Name = "sorular")]
        public async Task<IActionResult> Get(SoruSorgu sorgu)
        {

            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {
                var kayitlar = await soruStore.ListeGetirSorularAsync(sorgu);
                var sby = new StandartSayfaBilgiYaratici(sorgu, "Sorular", urlHelper);
                Response.Headers.Add("X-Pagination", kayitlar.SayfalamaMetaDataYarat<Soru>(sby));

                var sonuc = ListeSonuc<SoruListeDto>.IslemTamam(kayitlar.ToListeDto());

                return Ok(sonuc.ShapeData(sorgu.Alanlar));
            });
        }



        [HttpGet(Name = "HocaSorulari")]
        [Route("kullanicininsorulari")]
        public async Task<IActionResult> GetKulanicininSorulari(SoruSorgu sorgu)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {
                var personelNo = await kullaniciYonetici.PersonelNumarasiniAlAsync(aktifKullaniciNo);
                if (personelNo <= 0)
                {
                    throw new Exception();
                }

                var kayitlar = await soruStore.ListeGetirPersonelSorulariAsync(sorgu, personelNo);
                var sby = new StandartSayfaBilgiYaratici(sorgu, "Sorular", urlHelper);

                Response.Headers.Add("X-Pagination", kayitlar.SayfalamaMetaDataYarat<Soru>(sby));
                try
                {
                    var sonuc = ListeSonuc<SoruListeDto>.IslemTamam(kayitlar.ToListeDto());

                    return Ok(sonuc.ShapeData(sorgu.Alanlar));
                }
                catch (Exception e)
                {

                    throw;
                }
                throw new InternalServerError("Soru yaratılamadı!");

            });

        }
        [HttpGet("{id}", Name = "SoruListeOku")]
        public async Task<IActionResult> Get(int id)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {
                var soru = await soruStore.BulAsync(id);
                if (soru == null)
                    return NotFound("Soru bulunamadı");
                return Ok(soru.ToSoruListeDto());
            });
        }

        [HttpGet("sorual/{id}")]
        public async Task<IActionResult> GetSoruById(int id)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {

                var soru = await soruStore.BulAsync(id);
                if (soru == null)
                    return NotFound("Soru bulunamadı");
                var sonuc = KayitSonuc<SoruDegistirDto>.IslemTamam(soru.ToSoruDegistirDto());
                return Ok(sonuc);
            });
        }


        [AllowAnonymous]
        [HttpPost("coklusil")]
        public async Task<IActionResult> CokluSil([FromBody] int[] soruNumaralari)
        {

            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {

                var sonuc = await soruStore.CokluSil(soruNumaralari);
                try
                {

                    if (sonuc.Length > 0)
                    {

                        var kayitSonuc = ListeSonuc<int>.IslemTamam(sonuc);
                        kayitSonuc.Mesajlar[0]=$"{sonuc.Length} kayıt silindi";
                        return Ok(kayitSonuc);
                    }
                }
                catch (Exception e)
                {
                    throw new InternalServerError("Soru yaratılamadı!");
                }
                throw new InternalServerError("Soru yaratılamadı!");
            });
        }
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> YeniSoru([FromBody] SoruYaratDto yeniSoruDto)
        {

            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {

                var soru = await soruStore.YaratAsync(yeniSoruDto);
                try
                {
                    var sonuc = await soruStore.KaydetAsync();
                    if (sonuc)
                    {
                        var dbSoru = await soruStore.BulAsync(soru.SoruId);
                        //return CreatedAtRoute("SoruListeOku", new { id = soru.SoruId }, soru);
                        var kayitSonuc = KayitSonuc<SoruListeDto>.IslemTamam(dbSoru.ToSoruListeDto());
                        return Ok(kayitSonuc);
                    }
                }
                catch (Exception e)
                {
                    throw new InternalServerError("Soru yaratılamadı!");
                }
                throw new InternalServerError("Soru yaratılamadı!");
            });
        }


        [AllowAnonymous]
        [HttpPut]
        public async Task<IActionResult> SoruKaydet([FromBody] SoruDegistirDto degisecekSoru)
        {

            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {

                var kullanici = await kullaniciYonetici.FindByIdAsync("1");
                if (kullanici == null || !kullanici.EmailConfirmed || kullanici.Pasif)
                    throw new BadRequestError("Kullanıcı bilgisi yanlış");

                var veritabanindakiKayit = await soruStore.DegistirAsync(degisecekSoru);
                var sonuc = await soruStore.KaydetAsync();
                if (sonuc)
                {
                    var kayitSonuc = KayitSonuc<SoruListeDto>.IslemTamam(veritabanindakiKayit.ToSoruListeDto());

                    return Ok(kayitSonuc);
                }
                throw new InternalServerError("Soru yaratılamadı!");
            });
        }


        [AllowAnonymous]
        [HttpPut("kismen")]
        public async Task<IActionResult> SoruKaydet([FromBody] SoruAlanDegistirDto degisimBilgisi)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {


                var kullanici = await kullaniciYonetici.FindByIdAsync("1");
                if (kullanici == null || !kullanici.EmailConfirmed || kullanici.Pasif)
                    throw new BadRequestError("Kullanıcı bilgisi yanlış");

                var veritabanindakiKayit = await soruStore.KismenDegistirAsync(degisimBilgisi);

                var sonuc = await soruStore.KaydetAsync();
                if (sonuc)
                {
                    var kayitSonuc = KayitSonuc<SoruListeDto>.IslemTamam(veritabanindakiKayit.ToSoruListeDto());

                    return Ok(kayitSonuc);
                }
                throw new InternalServerError("Soru yaratılamadı!");
            });
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Sil(int id)
        {
            //Tamamen silme yok! Silindi olarak işaretleniyor.
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {

                var dbdekiKayit = await soruStore.BulAsync(id);
                if (dbdekiKayit == null)
                    return NotFound("Soru bulunamadı!");

                if (dbdekiKayit.Silinemez == true)
                    return BadRequest("Bu soru silinemez olarak işaretlenmiş!");

                //soruStore.Sil(dbdekiKayit);
                SoruAlanDegistirDto silmeBilgisi = new SoruAlanDegistirDto();
                silmeBilgisi.SoruNo = id;
                silmeBilgisi.Silindi = true;
                var veritabanindakiKayit = await soruStore.KismenDegistirAsync(silmeBilgisi);
                var sonuc = await soruStore.KaydetAsync();
                if (sonuc)
                {
                    var donecekSonuc = Sonuc.Tamam;

                    return Ok(donecekSonuc);
                }
                throw new InternalServerError("Soru yaratılamadı!");
            });

        }
    }
}