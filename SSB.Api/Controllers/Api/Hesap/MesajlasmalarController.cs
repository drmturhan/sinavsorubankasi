using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Core.Base.Hatalar;
using Core.EntityFramework;
using Identity.DataAccess;
using Identity.DataAccess.Dtos;
using Identity.DataAccess.Mappers;
using Identity.DataAccess.Repositories;
using Microsoft.AspNetCore.Mvc;
using Psg.Api.Base;

namespace Psg.Api.Controllers.Kullanicilar
{

    [Produces("application/json")]
    [Route("api/kullanicilar/{kullaniciNo}/[controller]")]

    public class MesajlasmalarController : MTSController
    {
        private readonly IMesajlasmaRepository mesajRepo;
        private readonly IUrlHelper urlHelper;

        public MesajlasmalarController(IMesajlasmaRepository mesajRepo, IUrlHelper urlHelper)
        {
            this.mesajRepo = mesajRepo;
            this.urlHelper = urlHelper;
        }

        [HttpGet("{id}", Name = "MesajAl")]

        public async Task<IActionResult> Get(int kullaniciNo, int id)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {
                if (kullaniciNo != aktifKullaniciNo)
                {
                    return Unauthorized();
                }
                var mesajFromRepo = await mesajRepo.BulAsync(id);
                if (mesajRepo == null)
                    return NotFound("Mesaj bulunamadı");
                return Ok(mesajFromRepo.ToListeDto());
            });
        }

        [HttpGet(Name = "Mesajlar")]
        public async Task<IActionResult> Get([FromRoute] int kullaniciNo, [FromQuery] MesajSorgu sorgu)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {

                if (kullaniciNo != aktifKullaniciNo)
                {
                    return Unauthorized();
                }
                sorgu.KullaniciNo = aktifKullaniciNo;
                var kayitlar = await mesajRepo.ListeleKullaniciyaGelenMesajlarAsync(sorgu);
                if (kayitlar == null)
                    return NotFound("Mesaj bulunamadı");


                var sby = new StandartSayfaBilgiYaratici(sorgu, "Mesajlar", urlHelper);
                Response.Headers.Add("X-Pagination", kayitlar.SayfalamaMetaDataYarat<Mesaj>(sby));

                var sonuc = ListeSonuc<Mesaj>.IslemTamam(kayitlar);
                ListeSonuc<MesajListeDto> donecekListe = sonuc.ToMesajListeDto();
                return Ok(donecekListe.ShapeData(sorgu.Alanlar));
            });

        }
        [HttpGet("yigin/{id}")]
        public async Task<IActionResult> Get(int kullaniciNo, int id, MesajSorgu sorgu)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {

                if (kullaniciNo != aktifKullaniciNo)
                {
                    return Unauthorized();
                }
                sorgu.KullaniciNo = aktifKullaniciNo;
                sorgu.DigerKullaniciNo = id;
                var kayitlar = await mesajRepo.ListeleMesajYiginiAsync(sorgu);
                if (kayitlar == null)
                    return NotFound("Mesaj bulunamadı");

                var sby = new StandartSayfaBilgiYaratici(sorgu, "Mesajlar", urlHelper);
                Response.Headers.Add("X-Pagination", kayitlar.SayfalamaMetaDataYarat<Mesaj>(sby));

                var sonuc = ListeSonuc<Mesaj>.IslemTamam(kayitlar);
                ListeSonuc<MesajListeDto> donecekListe = sonuc.ToMesajListeDto();
                return Ok(donecekListe.ShapeData(sorgu.Alanlar));
            });

        }


        [HttpPost]
        public async Task<IActionResult> Post(int kullaniciNo, [FromBody] MesajYaratmaDto mesaj)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {
                mesaj.GonderenNo = aktifKullaniciNo;
                var alici = mesajRepo.KullaniciBulAsyn(mesaj.AlanNo);
                if (alici == null)
                    return BadRequest("Alıcı bulunamadı!");
                var yaratilacakMesaj = mesaj.ToEntity();
                await mesajRepo.EkleAsync(yaratilacakMesaj);
                if (await mesajRepo.KaydetAsync())
                {
                    var yaratilanMesaj = await mesajRepo.BulAsync(yaratilacakMesaj.MesajId);
                    return CreatedAtRoute("MesajAl", new { id = yaratilacakMesaj.MesajId }, yaratilanMesaj.ToListeDto());
                }
                throw new InternalServerError("Mesaj yaratılamadı");
            });
        }
        [HttpPost("{id}")]
        public async Task<IActionResult> MesajSil(int kullaniciNo, int id)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {
                var mesajFromRepo = await mesajRepo.BulAsync(id);
                if (mesajFromRepo.GonderenNo == kullaniciNo)
                {
                    mesajFromRepo.GonderenSildi = true;
                }
                if (mesajFromRepo.AlanNo == kullaniciNo)
                {
                    mesajFromRepo.AlanSildi = true;
                }
                if (mesajFromRepo.GonderenSildi && mesajFromRepo.AlanSildi)
                {
                    mesajRepo.Sil(mesajFromRepo);
                }
                if (await mesajRepo.KaydetAsync())
                    return NoContent();
                throw new Exception("Mesaj silinemedi. Beklenmedik bir hata oluştu!");
            });
        }
        [HttpPost("{id}/okundu")]
        public async Task<IActionResult> MesajlariOkunduYap(int kullaniciNo, int id)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {
                var mesaj = await mesajRepo.BulAsync(id);
                if (mesaj.AlanNo != kullaniciNo)
                    throw new BadRequestError("Mesaj okundu olarak işaretlenemedi");
                mesaj.Okundu = true;
                mesaj.OkunmaZamani = DateTime.Now;
                if (await mesajRepo.KaydetAsync())
                    return NoContent();
                throw new BadRequestError("Mesaj okundu olarak işaretlenemedi");

            });
        }
    }
}