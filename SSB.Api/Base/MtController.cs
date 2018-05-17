using Core.Base.Hatalar;
using Core.EntityFramework;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Net.NetworkInformation;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Psg.Api.Base
{

    public class MTController : Controller
    {
       
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


        #region Yardimcilar
        protected string AnBilgisiAl()
        {

            return $"Kullanıcı:{User.Identity.Name}, Tarih:{DateTime.UtcNow}, IpNo:{GetClientIp()}, MACAddress:{GetClientMAC()}";
        }
        private string GetClientIp()
        {
            return HttpContext.Features.Get<IHttpConnectionFeature>()?.RemoteIpAddress?.ToString();//{Request.HttpContext.Connection.RemoteIpAddress} de kullanilmis orneklerde
        }

        private string GetClientMAC()
        {
            string macAddresses = "";

            foreach (NetworkInterface nic in NetworkInterface.GetAllNetworkInterfaces())
            {
                if (nic.OperationalStatus == OperationalStatus.Up)
                {
                    macAddresses += nic.GetPhysicalAddress().ToString();
                    break;
                }
            }
            return macAddresses;
        }
        #endregion


    }
    
}

