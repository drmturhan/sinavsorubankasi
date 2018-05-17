using AutoMapper;
using Core.Base;
using Core.EntityFramework;
using Identity.DataAccess;
using Identity.DataAccess.Mappers;
using Identity.DataAccess.Dtos;
using Identity.DataAccess.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Psg.Api.Base;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Core.Base.Hatalar;

namespace Psg.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/arkadasliklarim")]
    public class ArkadaslikliklarimController : MTSController
    {
        private readonly IArkadaslikRepository arkadaslikRepo;
        private readonly IUrlHelper urlHelper;

        public ArkadaslikliklarimController(
            IArkadaslikRepository arkdaslikRepo,
            IUrlHelper urlHelper)
        {
            this.arkadaslikRepo = arkdaslikRepo;
            this.urlHelper = urlHelper;
        }

        [HttpGet()]
        public async Task<IActionResult> Get(ArkadaslikSorgusu sorgu)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {
                sorgu.KullaniciNo = aktifKullaniciNo;
                //En az biri aktif kullanici degilse problem var!
                //if (sorgu.TeklifEdenKullaniciNo != currentUserId && sorgu.CevapVerecekKullaniciNo != currentUserId) return Unauthorized();
                var kayitlar = await arkadaslikRepo.ListeGetirTekliflerAsync(sorgu);
                var sby = new StandartSayfaBilgiYaratici(sorgu, "ArkadasliklarListesi", urlHelper);
                Response.Headers.Add("X-Pagination", kayitlar.SayfalamaMetaDataYarat<ArkadaslikTeklif>(sby));
                var sonuc = ListeSonuc<ArkadaslikTeklif>.IslemTamam(kayitlar);
                ListeSonuc<ArkadaslarimListeDto> donecekListe = sonuc.ToDto();
                if (donecekListe.KayitSayisi > 0)
                {
                    TeklifListesininArkadaslariniBelirle(aktifKullaniciNo, donecekListe);
                }
                return Ok(donecekListe.ShapeData(sorgu.Alanlar));

            });
        }

        private async Task<IActionResult> TeklifiDondur(int teklifEdenNo, int teklifAlanNo, int kullaniciNo)
        {

            var teklif = await arkadaslikRepo.TeklifiBulAsync(teklifEdenNo, teklifAlanNo);
            if (teklif != null)
            {
                var teklifDto = teklif.ToDto();
                TeklifinArkadasiniBelirle(kullaniciNo, teklifDto);
                return Ok(KayitSonuc<ArkadaslarimListeDto>.IslemTamam(teklifDto));
            }
            return BadRequest("Teklif bulunamadı!");

        }

        private void TeklifListesininArkadaslariniBelirle(int aktifKullaniciNo, ListeSonuc<ArkadaslarimListeDto> donecekListe)
        {
            for (int i = 0; i < donecekListe.DonenListe.Count; i++)
            {
                var at = donecekListe.DonenListe[i];
                TeklifinArkadasiniBelirle(aktifKullaniciNo, at);
            }
        }

        private static void TeklifinArkadasiniBelirle(int aktifKullaniciNo, ArkadaslarimListeDto teklif)
        {

            if (teklif.TeklifEden.Id == aktifKullaniciNo)
            {
                teklif.Arkadas = teklif.TeklifEdilen;
            }
            else teklif.Arkadas = teklif.TeklifEden;
        }

        [HttpPost("{isteyenId}/teklif/{cevaplayanId}")]
        public async Task<IActionResult> TeklifEt(int isteyenId, int cevaplayanId)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {
                if (isteyenId != aktifKullaniciNo)
                    throw new UnauthorizedError();
                if (isteyenId == cevaplayanId)
                    return BadRequest("Kendinize arkadaşlık teklif edemezsiniz!!!");

                if (await arkadaslikRepo.KullaniciBulAsync(cevaplayanId) == null)
                    return NotFound("Teklifi cevaplayacak kullanıcı bilgisi yok!");

                var teklifZatenVar = await arkadaslikRepo.TeklifiBulAsync(isteyenId, cevaplayanId);

                if (teklifZatenVar != null && teklifZatenVar.IptalEdenKullaniciNo != isteyenId)
                    return BadRequest("Bu kullanıcıya zaten arkadaşlık teklif ettiniz!");

                if (teklifZatenVar == null)
                    teklifZatenVar = await arkadaslikRepo.TeklifiBulAsync(cevaplayanId, isteyenId);

                if (teklifZatenVar != null && teklifZatenVar.IptalEdenKullaniciNo != isteyenId)
                    return BadRequest("Bu kullanıcı zaten size arkadaşlık teklif etmiş!");

                if (teklifZatenVar != null)
                {
                    teklifZatenVar.IptalTarihi = null;
                    teklifZatenVar.IptalEdildi = false;
                    teklifZatenVar.IptalEdenKullaniciNo = null;
                    if (await arkadaslikRepo.KaydetAsync())
                    {
                        return await TeklifiDondur(teklifZatenVar.TeklifEdenNo, teklifZatenVar.TeklifEdilenNo, aktifKullaniciNo);
                    }
                    else
                        throw new InternalServerError("Teklif kaydedilirken bir hata oluştu. Lütfen sonra tekrar deneyin...");
                }

                ArkadaslikTeklif yeniTeklif = new ArkadaslikTeklif
                {
                    TeklifEdenNo = isteyenId,
                    TeklifEdilenNo = cevaplayanId,
                    IstekTarihi = DateTime.Now
                };
                await arkadaslikRepo.EkleAsync<ArkadaslikTeklif>(yeniTeklif);
                if (await arkadaslikRepo.KaydetAsync())
                {
                    return await TeklifiDondur(yeniTeklif.TeklifEdenNo, yeniTeklif.TeklifEdilenNo, aktifKullaniciNo);
                }
                return BadRequest("Arkadaşlık teklifi yapılamad!");
            });
        }


        [HttpPost("{isteyenId}/teklifiptal/{cevaplayanId}")]
        public async Task<IActionResult> TeklifIptalEt(int isteyenId, int cevaplayanId)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {

                var teklif = await arkadaslikRepo.TeklifiBulAsync(isteyenId, cevaplayanId);

                if (teklif == null)
                    return NotFound("Arkadaşlık bilgisine ulaşılamadı");
                if (await arkadaslikRepo.KullaniciBulAsync(cevaplayanId) == null)
                    return NotFound();

                if (teklif.IptalEdildi == true)
                    return BadRequest("Teklif zaten iptal edilmiş durumda!");
                teklif.IptalEdildi = true;
                teklif.IptalEdenKullaniciNo = aktifKullaniciNo;
                teklif.IptalTarihi = DateTime.Now;

                if (await arkadaslikRepo.KaydetAsync())
                {
                    return await TeklifiDondur(teklif.TeklifEdenNo, teklif.TeklifEdilenNo, aktifKullaniciNo);
                }
                return BadRequest("Arkadaşlık teklifi iptal edilemedi!");
            });

        }
        [HttpPost("{isteyenId}/kararver/{cevaplayanId}")]
        public async Task<IActionResult> TeklifeKararVer(int isteyenId, int cevaplayanId,  [FromBody] bool karar)
        {
            return await KullaniciVarsaCalistir<IActionResult>(async () =>
            {

                var teklif = await arkadaslikRepo.TeklifiBulAsync(isteyenId, cevaplayanId);
                if (teklif == null)
                    return NotFound("Arkadaşlık bilgisine ulaşılamadı");
                if (await arkadaslikRepo.KullaniciBulAsync(cevaplayanId) == null)
                    return NotFound();

                if (teklif.IptalEdildi == true)
                    return BadRequest("Teklif zaten iptal edilmiş durumda!");
                teklif.Karar = karar;
                teklif.CevapTarihi = DateTime.Now;

                if (await arkadaslikRepo.KaydetAsync())
                    return await TeklifiDondur(teklif.TeklifEdenNo, teklif.TeklifEdilenNo, aktifKullaniciNo);
                return BadRequest("Arkadaşlık teklifi kararı kaydedilemedi!");
            });

        }
    }

}