using Core.Base;
using Core.EntityFramework;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Psg.Api.Base;
using System;
using System.Collections.Generic;
using System.Text;

namespace Psg.Api.Extensions
{
    public static class ExceptionExtensions
    {
        public static void SonucaYaz<T>(this Exception hata, Sonuc sonuc)
        {
            if (sonuc == null) return;
            List<Hata> hatalar = new List<Hata> { new Hata { Kod = "", Tanim = hata.Message } };
            hatalar.ForEach(h => sonuc.Hatalar.Add(h));
            if (hata.InnerException != null)
                hata.InnerException.SonucaYaz<T>(sonuc);
        }

        public static void UygulamaHatasiEkle(this HttpResponse response, Exception hata)
        {
            response.Headers.Add("Uygulama-Hatası", HataCumlesiniAl(hata));
            response.Headers.Add("Access-Control-Expose-Headers", "Uygulama-Hatasu");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
        }

        private static StringValues HataCumlesiniAl(Exception hata)
        {
            StringBuilder sb = new StringBuilder();
            HataEkle(sb, hata);
            return new StringValues(sb.ToString());
        }

        private static void HataEkle(StringBuilder sb, Exception hata)
        {
            sb.AppendLine(hata.Message);
            if (hata.InnerException != null)
                HataEkle(sb, hata.InnerException);
        }

    }
}