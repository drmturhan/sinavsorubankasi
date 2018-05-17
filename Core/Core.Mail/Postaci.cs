using Core.Base;
using Microsoft.Extensions.Options;
using System;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace Core.Mail
{

    public class Postaci : IEmailSender
    {
        private readonly EpostaHesapBilgileri postaHesabi;

        public Postaci(IOptions<EpostaHesapBilgileri> postaHesabi)
        {
            this.postaHesabi = postaHesabi.Value;
        }
        public async Task SendEmailAsync(string aliciEposta, string konu, string mesaj)
        {
            if (string.IsNullOrEmpty(aliciEposta)) throw new Exception("Eposta adresi boş olamaz!");
            if (string.IsNullOrEmpty(konu)) throw new Exception("Konu adresi boş olamaz!");
            if (string.IsNullOrEmpty(mesaj)) throw new Exception("Mesaj adresi boş olamaz!");
            try
            {
                var emailMessage = new MailMessage(new MailAddress(postaHesabi.KullaniciAdi), new MailAddress(aliciEposta));

                emailMessage.BodyEncoding = Encoding.UTF8;
                emailMessage.SubjectEncoding = Encoding.UTF8;

                emailMessage.Subject = konu;
                emailMessage.Body = mesaj;
                var sunucu = new SmtpClient(postaHesabi.Sunucu);
                sunucu.Port = postaHesabi.TLSBaglantiNoktasi;
                sunucu.DeliveryFormat = SmtpDeliveryFormat.International;
                sunucu.DeliveryMethod = SmtpDeliveryMethod.Network;
                sunucu.UseDefaultCredentials = false;
                sunucu.Port = postaHesabi.TLSBaglantiNoktasi;
                sunucu.EnableSsl = postaHesabi.SSLGerektirir;
                sunucu.Credentials = new NetworkCredential(postaHesabi.KullaniciAdi,postaHesabi.Sifre);
                await sunucu.SendMailAsync(emailMessage);
            }
            catch (Exception hata)
            {
            }
        }


    }
}
