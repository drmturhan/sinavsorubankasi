using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Psg.Api.Repos;
using System;
using Psg.Api.Base;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Dynamic;
using System.Reflection;
using System.Collections.Generic;
using Core.EntityFramework;
using Identity.DataAccess.Repositories;

namespace Psg.Api.Helpers
{
    public class KullaniciAktiviteleriniTakipEt : IAsyncActionFilter
    {


        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();
            var kullaniciClaim = resultContext.HttpContext.User.FindFirst("id");
            if (kullaniciClaim != null)
            {
                var kullaniciNo = int.Parse(kullaniciClaim.Value);
                if (kullaniciNo <= 0) return;
                var repo = resultContext.HttpContext.RequestServices.GetService<IKullaniciRepository>();
                var kullanici = await repo.BulAsync(kullaniciNo);
                if (kullanici == null) return;
                kullanici.SonAktifOlmaTarihi = DateTime.Now;
                await repo.KaydetAsync();
            }
        }
    }

}
