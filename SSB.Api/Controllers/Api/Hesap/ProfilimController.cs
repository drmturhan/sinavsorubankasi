using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Core.Base;
using Core.EntityFramework;
using Identity.DataAccess.Dtos;
using Identity.DataAccess.Mappers;
using Identity.DataAccess.Repositories;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Psg.Api.Base;
using Psg.Api.Preferences;

namespace Psg.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]

    public class ProfilimController : MTSController
    {
        private readonly IKullaniciRepository repo;
        private readonly FotografAyarlari fotografAyarlari;
        private readonly IHostingEnvironment host;
        private readonly IOptions<CloudinarySettings> cloudinaryConfig;
        private readonly Cloudinary cloudinary;
        public ProfilimController(IKullaniciRepository repo, IOptions<FotografAyarlari> fotografAyarlari, IHostingEnvironment host, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            this.repo = repo;
            this.fotografAyarlari = fotografAyarlari.Value;
            this.host = host;
            this.cloudinaryConfig = cloudinaryConfig;
            Account acc = new Account(cloudinaryConfig.Value.CloudName, cloudinaryConfig.Value.ApiKey, cloudinaryConfig.Value.ApiSecret);
            cloudinary = new Cloudinary(acc);
        }
        [HttpGet(Name = "profilFotografiniAl")]
        public async Task<IActionResult> ProfilFotografiniAl()
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
               {
                   var entity = await repo.FotografBulAsync(aktifKullaniciNo);

                   return Ok(entity.ToFotoOkuDto());
               });
        }

        [HttpPost("fotografEkle")]
        public async Task<IActionResult> ProfilimeFotografEkle(FotografYazDto dto)
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

                var kullanici = await repo.BulAsync(aktifKullaniciNo);
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
                    {
                        var donecekFoto = foto.ToFotoOkuDto();
                        return CreatedAtRoute("profilFotografiniAl", new { id = foto.FotoId }, donecekFoto);
                    }

                }
                catch (Exception hata)
                {
                    return BadRequest("Fotoğraf eklenemedi!");
                }
                return BadRequest("Fotoğraf eklenemedi!");
            });
        }

        private async Task<string> LokaldeKaydet(FotografYazDto dto)
        {
            try
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
            catch (Exception hata)
            {
                return "";
            }
        }

        private void BulutaYukle(FotografYazDto dto)
        {
            try
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
            catch (Exception hata)
            {

            }
        }

        [HttpPost("profilFotografiYap")]
        public async Task<IActionResult> ProfilFotografiYap([FromBody]int fotoId)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {
                Sonuc sonuc = null;
                var dbdekiKayit = await repo.FotografBulAsync(fotoId);
                if (dbdekiKayit == null)
                {
                    sonuc = Sonuc.Basarisiz(new Hata[] { new Hata { Kod = "", Tanim = "Profil fotoğrafı bulunamadı!" } });
                    return Ok(sonuc);
                }
                if (dbdekiKayit.ProfilFotografi)
                {
                    sonuc = Sonuc.Basarisiz(new Hata[] { new Hata { Kod = "", Tanim = "Bu fotoğraf zaten profil fotoğrafı!" } });
                    return Ok(sonuc);
                }
                var suankiAsilFoto = await repo.KullanicininAsilFotosunuGetirAsync(aktifKullaniciNo);

                if (suankiAsilFoto != null)
                    suankiAsilFoto.ProfilFotografi = false;

                dbdekiKayit.ProfilFotografi = true;
                if (await repo.KaydetAsync())
                {
                    sonuc = Sonuc.Tamam;
                    sonuc.Mesajlar[0] = "Profil fotoğrafı değiştirildi.";
                }
                else
                    sonuc = Sonuc.Basarisiz(new Hata[] { new Hata { Kod = "", Tanim = "Profil fotoğrafı değiştirilemedi!" } });
                return Ok(sonuc);
            });

        }
        [HttpGet("{id}", Name = "ProfilimiGetir")]
        public async Task<IActionResult> Get(int id, [FromQuery] string neden, [FromQuery] string alanlar)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {
                Sonuc sonuc = null;
                if (id <= 0)
                {
                    sonuc = Sonuc.Basarisiz(new Hata[] { new Hata { Kod = "", Tanim = SonucMesajlari.Liste[MesajAnahtarlari.SifirdanBuyukDegerGerekli] } });
                    return Ok(sonuc);
                }

                if (id != aktifKullaniciNo)
                {
                    sonuc = Sonuc.Basarisiz(new Hata[] { new Hata { Kod = "", Tanim = "Profil fotoğrafı değiştirilemedi!" } });
                    return Ok(sonuc);
                }

                var kayit = await repo.BulAsync(id);
                if (kayit == null)
                {
                    sonuc = Sonuc.Basarisiz(new Hata[] { new Hata { Kod = "", Tanim = "Kullanıcı bulunamadı!" } });
                    return Ok(sonuc);
                }
                if (neden == "yaz")
                {
                    var yazSonucDto = KayitSonuc<ProfilOku>.IslemTamam(kayit.ToProfilOkuDto());
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
                Sonuc sonuc = null;
                var userFromRepo = await repo.BulAsync(aktifKullaniciNo);
                if (userFromRepo == null)
                {
                    sonuc = Sonuc.Basarisiz(new Hata[] { new Hata { Kod = "", Tanim = $"{id} numaralı kullanıcı bulunamadı!" } });
                    return Ok(sonuc);
                }
                if (aktifKullaniciNo != userFromRepo.Id)
                {
                    sonuc = Sonuc.Basarisiz(new Hata[] { new Hata { Kod = "", Tanim = "Sizin dışınızdaki kullanıcıyı değiştirme yetkiniz yok!" } });
                    return Ok(sonuc);
                }

                KullaniciMappers.Kopyala(yazDto, userFromRepo);
                if (await repo.KaydetAsync())
                {
                    sonuc = Sonuc.Tamam;
                    sonuc.Mesajlar[0] = "Kullanıcı bilgileri kaydedildi.";
                    return Ok();
                }
                sonuc = Sonuc.Basarisiz(new Hata[] { new Hata { Kod = "", Tanim = $"{id} numaralı kullanıcı bilgileri kaydedilemedi!" } });
                return Ok(sonuc);

            });

        }

        [HttpDelete("FotografSil/{id}")]
        public async Task<IActionResult> Sil(int id)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
               {
                   Sonuc sonuc = null;

                   var dbdekiKayit = await repo.FotografBulAsync(id);
                   if (dbdekiKayit == null)
                   {
                       sonuc = Sonuc.Basarisiz(new Hata[] { new Hata { Kod = "", Tanim = "Fotoğraf bulunamadı!" } });
                       return Ok(sonuc);
                   }


                   if (dbdekiKayit.ProfilFotografi)
                   {
                       sonuc = Sonuc.Basarisiz(new Hata[] { new Hata { Kod = "", Tanim = "Asıl fotoğrafı silemezsiniz!" } });
                       return Ok(sonuc);
                   }

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
                   {
                       sonuc = Sonuc.Tamam;
                       sonuc.Mesajlar[0] = "Fotoğraf silindi";
                       return Ok(sonuc);
                   }
                   sonuc = Sonuc.Basarisiz(new Hata[] { new Hata { Kod = "", Tanim = "Fotoğraf silinemedi!" } });
                   return Ok(sonuc);
               });
        }

    }
}