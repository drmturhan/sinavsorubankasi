using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Core.Base.Hatalar;
using Core.EntityFramework;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Psg.Api.Helpers;

namespace Psg.Api.Base
{
    [ServiceFilter(typeof(KullaniciAktiviteleriniTakipEt))]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class MTSController : MTController
    {
        protected int aktifKullaniciNo = -1;
        protected async Task<IActionResult> KullaniciVarsaCalistir<R>(Func<Task<IActionResult>> codetoExecute) where R : class
        {
            var aktifKullaniciClaim = User.FindFirst("id");
            if (aktifKullaniciClaim == null)
                return Unauthorized();

            aktifKullaniciNo = int.Parse(aktifKullaniciClaim.Value);

            if (!ModelState.IsValid)
                return new DortYuzYirmiIkiResult(ModelState);

            try
            {
                return await codetoExecute.Invoke();
            }

            catch (BadRequestError hata)
            {
                return BadRequest(new BadRequestError(hata.Message));
            }
            catch (ModelValidationError)
            {
                return new DortYuzYirmiIkiResult(ModelState);
            }
            catch (UnauthorizedError)
            {
                return Unauthorized();
            }
            catch (NotFoundError hata)
            {
                return NotFound(Sonuc.Basarisiz(new Exception("Kayıt bulunamadı!", hata)));
            }
            catch (InternalServerError hata)
            {
                return NotFound(Sonuc.Basarisiz(new Exception("İşlem başarısız. Lütfen daha sonra tekrar deneyiniz!", hata)));
            }
            catch (Exception hata)
            {
                return StatusCode(500, Sonuc.Basarisiz(new Exception(Properties.Resources.IslemGerceklesmedi, hata)));
            }
        }
        protected async Task<IActionResult> HataKontrolluDondur<R>(Func<Task<IActionResult>> codetoExecute) where R : class
        {
            if (!ModelState.IsValid)
                return new DortYuzYirmiIkiResult(ModelState);
            try
            {
                return await codetoExecute.Invoke();
            }

            catch (BadRequestError hata)
            {
                return BadRequest(new BadRequestError(hata.Message));
            }
            catch (ModelValidationError)
            {
                return new DortYuzYirmiIkiResult(ModelState);
            }
            catch (NotFoundError hata)
            {
                return NotFound(Sonuc.Basarisiz(new Exception("Kayıt bulunamadı!", hata)));
            }
            catch (InternalServerError hata)
            {
                return NotFound(Sonuc.Basarisiz(new Exception("İşlem başarısız. Lütfen daha sonra tekrar deneyiniz!", hata)));
            }
            catch (Exception hata)
            {
                return StatusCode(500, Sonuc.Basarisiz(new Exception(Properties.Resources.IslemGerceklesmedi, hata)));
            }
        }

    }
}