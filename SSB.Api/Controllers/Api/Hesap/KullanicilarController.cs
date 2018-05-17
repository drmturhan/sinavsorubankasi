using Core.Base;
using Core.EntityFramework;
using Identity.DataAccess;
using Identity.DataAccess.Dtos;
using Identity.DataAccess.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Psg.Api.Base;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Identity.DataAccess.Mappers;
using Psg.Api.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Psg.Api.Controllers
{

    [Produces("application/json")]
    [Route("api/kullanicilar")]
    public class KullanicilarController : MTSController
    {
        private readonly IKullaniciRepository kullaniciRepo;
        private readonly IUrlHelper urlHelper;

        public KullanicilarController(
            IKullaniciRepository kullaniciRepo,
            IUrlHelper urlHelper
            )
        {
            this.kullaniciRepo = kullaniciRepo;
            this.urlHelper = urlHelper;
        }

        [HttpGet(Name = "Kullanicilar")]
        public async Task<IActionResult> Get(KullaniciSorgu sorgu)
        {
            return await KullaniciVarsaCalistir<Task<IActionResult>>(async () =>
            {
                var kayitlar = await kullaniciRepo.ListeGetirKullanicilarTumuAsync(sorgu);
                var sby = new StandartSayfaBilgiYaratici(sorgu, "Kullanicilar", urlHelper);

                Response.Headers.Add("X-Pagination", kayitlar.SayfalamaMetaDataYarat<Kullanici>(sby));

                var sonuc = ListeSonuc<Kullanici>.IslemTamam(kayitlar);

                ListeSonuc<KullaniciListeDto> donecekListe = sonuc.ToKullaniciDetayDto();
                return Ok(donecekListe.ShapeData(sorgu.Alanlar));
            });
        }



        [HttpGet("{id}", Name = "KullaniciGetir")]
        public async Task<IActionResult> Get(int id, [FromQuery] string neden, [FromQuery] string alanlar)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {
                if (id <= 0)
                    return BadRequest(KayitSonuc<ProfilYazDto>.Basarisiz(new Hata[] { new Hata { Kod = "", Tanim = SonucMesajlari.Liste[MesajAnahtarlari.SifirdanBuyukDegerGerekli] } }));

                var kayit = await kullaniciRepo.BulAsync(id);
                if (kayit == null)
                {
                    var sonuc = Sonuc.Basarisiz(new Hata[] { new Hata { Kod = "", Tanim = "Kullanıcı bulunamadı!" } });
                    return Ok(sonuc);
                }
                if (neden == "yaz")
                {
                    var yazSonucDto = KayitSonuc<ProfilYazDto>.IslemTamam(kayit.ToDto());
                    return Ok(yazSonucDto.ShapeData(alanlar));
                }
                var resource = KayitSonuc<KullaniciDetayDto>.IslemTamam(kayit.ToKullaniciDetayDto());
                return Ok(resource.ShapeData(alanlar));

            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProfilYazDto yazDto)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                var userFromRepo = await kullaniciRepo.BulAsync(aktifKullaniciNo);
                if (userFromRepo == null)
                    return NotFound($"{id} numaralı kullanıcı bulunamadı!");
                if (aktifKullaniciNo != userFromRepo.Id)
                    return Unauthorized();

                KullaniciMappers.Kopyala(yazDto, userFromRepo);
                userFromRepo.SonAktifOlmaTarihi = DateTime.Now;

                if (await kullaniciRepo.KaydetAsync())
                    return Ok(Sonuc.Tamam);
                else throw new Exception($"{id} numaralı kullanıcı bilgileri kaydedilemedi!");
            });

        }

      

        [HttpDelete("{id}")]
        public async Task<IActionResult> Sil(int id)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {
                if (id <= 0)
                    BadRequest("Silmek istediğiniz kullanıcı numarası yanlış!!");
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                if (currentUserId == id)
                    return BadRequest("Kendinizi silemezsiniz!!");
                var dbdekiKullanici = await kullaniciRepo.BulAsync(id);
                if (dbdekiKullanici == null)
                    NotFound("Silmek istediğiniz kullanıcı bulunamadı!");
                kullaniciRepo.Sil<Kullanici>(dbdekiKullanici);
                if (await kullaniciRepo.KaydetAsync())
                {
                    kullaniciRepo.KisileriniSil(dbdekiKullanici.Kisi);
                    await kullaniciRepo.KaydetAsync();
                    return NoContent();
                }
                return BadRequest("Kullanıcı silinemedi!");
            });
        }


        
    }
}