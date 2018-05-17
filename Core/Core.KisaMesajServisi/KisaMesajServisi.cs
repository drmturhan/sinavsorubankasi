using Core.Base;
using Microsoft.Extensions.Options;
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Core.KisaMesajServisi
{
    public class KisaMesajServisi:ISmsSender
    {
        private readonly SMSHesapBilgileri smsHesabi;
        public KisaMesajServisi(IOptions<SMSHesapBilgileri> smsHesapBilgileri)
        {
            smsHesabi = smsHesapBilgileri.Value;

        }
        public async Task SendSmsAsync(string number, string message)
        {
            string kullaniciAdi = smsHesabi.KullaniciAdi;
            string sifre = smsHesabi.Sifre;
            StringBuilder sb = new StringBuilder();
            sb.Append("<request>");
            sb.Append("<authentication>");
            sb.Append($"<username>{kullaniciAdi}</username>");
            sb.Append($"<password>{sifre}</password>");
            sb.Append("</authentication>");
            sb.Append("<order>");
            sb.Append("<sender>DRMTURHAN</sender>");
            sb.Append($"<sendDateTime></sendDateTime>");
            sb.Append("<message>");
            sb.Append($"<text>{message}</text>");
            sb.Append("<receipents>");
            sb.Append($"<number>" + number + "</number>");
            sb.Append("</receipents>");
            sb.Append("</message>");
            sb.Append("</order>");
            sb.Append("</request>");
            var xmldoc = sb.ToString();
            using (var client = new HttpClient())
            {
                var baseUri = "http://api.iletimerkezi.com/v1/send-sms";
                client.BaseAddress = new Uri(baseUri);
                client.DefaultRequestHeaders.Accept.Clear();
                var response = await client.PostAsync(baseUri, new StringContent(xmldoc, Encoding.UTF8, "application/xml"));
                if (response.IsSuccessStatusCode)
                {
                    var responseJson = await response.Content.ReadAsStringAsync();
                    //do something with the response here. Typically use JSON.net to deserialise it and work with it
                }
            }
        }
    }
}
