using Microsoft.AspNetCore.Http;
using System;
using System.Text;

namespace Psg.Api.Helpers
{
    public static class ErrorExtensions
    {

        public static void UygulamaHatasiEkle(this HttpResponse response, string message)
        {
            response.Headers.Add("Application-Error", message);
            response.Headers.Add("Access-Control-Allow-Origin", "*");
            response.Headers.Add("access-control-expose-headers", "Application-Error");
            
        }

        private static string HataCumlesiniAl(Exception hata)
        {
            StringBuilder sb = new StringBuilder();
            HataEkle(sb, hata);
            return sb.ToString();
        }

        private static void HataEkle(StringBuilder sb, Exception hata)
        {
            sb.AppendLine(hata.Message);
            if (hata.InnerException != null)
                HataEkle(sb, hata.InnerException);
        }
    }
   
}
