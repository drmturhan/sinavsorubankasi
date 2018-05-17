using System;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Core.Base;
using Identity.DataAccess.Dtos;
using Identity.DataAccess.Mappers;
using Identity.DataAccess.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Psg.Api.Base;
using Psg.Api.Models;
using Psg.Api.Preferences;

namespace Psg.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/kullanicilar/{kullaniciNo}/fotograflari")]
    
    public class KullaniciFotograflariController : MTSController
    {
        private readonly KullaniciRepository repo;
        private readonly FotografAyarlari fotografAyarlari;
        private readonly IHostingEnvironment host;
        private readonly IOptions<CloudinarySettings> cloudinaryConfig;
        private readonly Cloudinary cloudinary;
        public KullaniciFotograflariController(KullaniciRepository repo, IOptions<FotografAyarlari> fotografAyarlari, IHostingEnvironment host, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            this.repo = repo;
            this.fotografAyarlari = fotografAyarlari.Value;
            this.host = host;
            this.cloudinaryConfig = cloudinaryConfig;
            Account acc = new Account(cloudinaryConfig.Value.CloudName, cloudinaryConfig.Value.ApiKey, cloudinaryConfig.Value.ApiSecret);
            cloudinary = new Cloudinary(acc);
        }
        [HttpGet(Name = "KullaniciFotografiniAl")]
        public async Task<IActionResult> KullaniciFotografiniAl(int kullaniciNo)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
               {
                   var entity = await repo.FotografBulAsync(kullaniciNo);

                   return Ok(entity.ToFotoOkuDto());
               });
        }

        [HttpPost]
        public async Task<IActionResult> KullaniciyaFotografEkle(int kullaniciNo, FotografYazDto dto)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {


                if (dto.File == null)
                    return BadRequest("Fotoğraf yok!");
                if (dto.File.Length == 0)
                    return BadRequest("Fotoğraf dosyası boş!");
                if (dto.File.Length > fotografAyarlari.MaxBytes) return BadRequest($"Dosya çok büyük. En fazla {fotografAyarlari.MaxBytes / (1024 * 1024)} MB resim yükleyebilirsiniz");
                if (!fotografAyarlari.DosyaTipUygunmu(dto.File.FileName))
                    return BadRequest("Dosya tipini yükleme izni yok! Sadece resim dosyalarını yükleyebilirsiniz.");

                var kullanici = await repo.BulAsync(kullaniciNo);
                if (kullanici == null)
                    return BadRequest("Kullanıcı bulunamadı!");

                if (aktifKullaniciNo != kullanici.Id)
                    return Unauthorized();
                string dosyaAdi = string.Empty;
                if (!fotografAyarlari.SadeceBulutaYukle)
                    dosyaAdi = await LokaldeKaydet(dto);

                if (!fotografAyarlari.SadeceLokaldeTut)
                    BulutaYukle(dto);
                try
                {
                    var foto = dto.ToEntity();
                    foto.Kisi = kullanici.Kisi;

                    if (!kullanici.Kisi.Fotograflari.Any(m => m.ProfilFotografi))
                        foto.ProfilFotografi = true;

                    foto.DosyaAdi = dosyaAdi;
                    kullanici.Kisi.Fotograflari.Add(foto);
                    if (await repo.KaydetAsync())
                        return CreatedAtRoute("KullaniciFotografiniAl", new { id = foto.FotoId}, foto.ToFotoOkuDto());
                    
                }
                catch(Exception hata)
                {
                    return BadRequest("Fotoğraf eklenemedi!");
                }
                return BadRequest("Fotoğraf eklenemedi!");
            });
        }

        private async Task<string> LokaldeKaydet(FotografYazDto dto)
        {
            var yuklemeYolu = Path.Combine(host.WebRootPath, "Resimler");
            if (!Directory.Exists(yuklemeYolu))
                Directory.CreateDirectory(yuklemeYolu);
            var dosyaAdi = Guid.NewGuid().ToString() + Path.GetExtension(dto.File.FileName);
            var dosyaYolu = Path.Combine(yuklemeYolu, dosyaAdi);

            using (var stream = new FileStream(dosyaYolu, FileMode.Create))
            {
                await dto.File.CopyToAsync(stream);
            }

            return dosyaAdi;
        }

        private void BulutaYukle(FotografYazDto dto)
        {
            var dosya = dto.File;
            var yuklemeSonucu = new ImageUploadResult();
            if (dosya.Length > 0)
            {
                using (var stream = dosya.OpenReadStream())
                {
                    var yuklemePrametreleri = new ImageUploadParams()
                    {
                        File = new FileDescription(dosya.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")

                    };
                    yuklemeSonucu = cloudinary.Upload(yuklemePrametreleri);
                }
            }
            dto.Url = yuklemeSonucu.Uri.ToString();
            dto.PublicId = yuklemeSonucu.PublicId;
        }

        [HttpPost("{id}/asilYap")]
        public async Task<IActionResult> AsilFotoYap(int kullaniciNo, int id)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {

                var dbdekiKayit = await repo.FotografBulAsync(id);
                if (dbdekiKayit == null)
                    return NotFound("Fotoğraf bulunamadı!");

                if (dbdekiKayit.ProfilFotografi)
                    return BadRequest("Bu fotoğraf zaten asıl fotoğraf!");
                var suankiAsilFoto = await repo.KullanicininAsilFotosunuGetirAsync(kullaniciNo);
                if (suankiAsilFoto != null)
                    suankiAsilFoto.ProfilFotografi = false;
                dbdekiKayit.ProfilFotografi = true;
                if (await repo.KaydetAsync())
                    return NoContent();
                return BadRequest("Asıl foto yapılamadı!");
            });

        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Sil(int kullaniciNo, int id)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
               {
                   if (kullaniciNo != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                       Unauthorized();
                   var dbdekiKayit = await repo.FotografBulAsync(id);
                   if (dbdekiKayit == null)
                       return NotFound("Fotoğraf bulunamadı!");

                   if (dbdekiKayit.ProfilFotografi)
                       return BadRequest("Asıl fotoğrafı silemezsiniz!");
                   if (dbdekiKayit.PublicId != null)
                   {

                       var deleteParams = new DeletionParams(dbdekiKayit.PublicId);
                       var result = cloudinary.Destroy(deleteParams);
                       if (result.Result == "ok")
                           repo.Sil(dbdekiKayit);
                   }
                   if (dbdekiKayit.PublicId == null)
                       repo.Sil(dbdekiKayit);

                   if (await repo.KaydetAsync())
                       return Ok();
                   else
                       return BadRequest("Fotoğraf silinemedi");

               });

        }


    }
}