using Core.Base;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Core.Mail
{
    public class PostaciKit: IEmailSender
    {
        private readonly EpostaHesapBilgileri postaHesabi;

        public PostaciKit(IOptions<EpostaHesapBilgileri> postaHesabi)
        {
            this.postaHesabi = postaHesabi.Value;
        }
        public async Task SendEmailAsync(string aliciEposta, string konu, string mesaj)
        {
            var emailMessage = new MimeMessage();
            string[] adresler = aliciEposta.Split(';');
            if (adresler.Length == 0)
                throw new ArgumentException("Göndermek istediğiniz eposta adresi yok!");
            else
            {
                foreach (string adres in adresler)
                {
                    emailMessage.To.Add(new MailboxAddress("", adres));
                }
            }
            emailMessage.From.Add(new MailboxAddress("bilgi@drmturhan.com"));
            emailMessage.Subject = konu;
            emailMessage.Body = new TextPart(TextFormat.Html) { Text = mesaj };

            await Task.Run(() =>
            {

                try
                {
                    using (var client = new SmtpClient())
                    {
                        client.Connect("outlook.office365.com", 587, MailKit.Security.SecureSocketOptions.StartTls);

                        // Note: since we don't have an OAuth2 token, disable
                        // the XOAUTH2 authentication mechanism.
                        client.AuthenticationMechanisms.Remove("XOAUTH2");
                        
                        // Note: only needed if the SMTP server requires authentication
                        client.Authenticate("bilgi@drmturhan.com", "!9Kasim2001gozde");

                        client.Send(emailMessage);
                        client.Disconnect(true);
                    }
                }
                catch (Exception hata)
                {

                    
                }
            });
        }
    }
}
