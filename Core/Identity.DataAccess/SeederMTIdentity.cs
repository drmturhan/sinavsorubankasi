
using System;
using System.Linq;
using Microsoft.Extensions.Configuration;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Core.EntityFramework;
using Core.Base;
using System.Security.Claims;

namespace Identity.DataAccess
{

    public class MTIdentitySeeder
    {
        private readonly MTIdentityDbContext identityContext;
        private readonly IHostingEnvironment _hosting;
        private readonly KullaniciYonetici _userManager;
        private readonly RolYonetici rolYonetici;

        public MTIdentitySeeder(IHostingEnvironment hosting,
            MTIdentityDbContext ctx,
          KullaniciYonetici userManager, RolYonetici rolYonetici)
        {
            identityContext = ctx;
            _hosting = hosting;
            _userManager = userManager;
            this.rolYonetici = rolYonetici;
            var migrasyonGerekli = ctx.Database.GetPendingMigrations();
            if (migrasyonGerekli.Count() > 0)
            {
                ctx.Database.Migrate();
            }
        }

        public int Oncelik { get; private set; } = 10;
        public async Task Seed()
        {
            Console.WriteLine("Identity Veri yüklemesi başladı...");

            await SeedUser();
            Console.WriteLine("Identity Veri yüklemesi bitti...");
            Console.WriteLine();
        }

        private async Task SeedUser()
        {
            Console.WriteLine("Veritabanı kontrol ediliyor...");
            var user = await _userManager.FindByEmailAsync("drmturhan@hotmail.com");
            if (user == null)
            {


                if (!identityContext.Cinsiyetler.Any())
                    await SeederService.VeriEkle<KisiCinsiyet>(identityContext, "Cinsiyetler", Path.Combine(_hosting.ContentRootPath, "Seeds", "Veriler", "cinsiyetler.json"));
                if (!identityContext.MedeniHaller.Any())
                    await SeederService.VeriEkle<MedeniHal>(identityContext, "Medeni Haller", Path.Combine(_hosting.ContentRootPath, "Seeds", "Veriler", "MedeniHaller.json"));

                if (!identityContext.Roles.Any())
                {
                    var dosyaYolu = Path.Combine(_hosting.ContentRootPath, "Seeds", "Veriler", "roller.json");
                    if (!File.Exists(dosyaYolu)) return;
                    var json = File.ReadAllText(dosyaYolu);
                    var eklenecekRoller = JsonConvert.DeserializeObject<IEnumerable<Rol>>(json);
                    if (eklenecekRoller != null)
                    {

                        foreach (var rol in eklenecekRoller)
                        {
                            var sonuc = await rolYonetici.CreateAsync(rol);
                        }
                    }
                }

                Console.WriteLine("Kullanıcı ekleniyor...");
                user = new Kullanici()
                {

                    UserName = "mturhan",
                    Email = "drmturhan@hotmail.com",
                    EmailConfirmed = true,
                    YaratilmaTarihi = DateTime.Now,
                    Pasif = false,
                    Yonetici = true,
                };
                user.Kisi = new KullaniciKisi
                {
                    Unvan = "Doç.Dr.",
                    Ad = "Murat",
                    Soyad = "Turhan",
                    CinsiyetNo = 1,
                    MedeniHalNo = 2,
                    DogumTarihi = new DateTime(1970, 11, 15)
                };
                var result = await _userManager.CreateAsync(user, "Akd34630.");
                if (result == IdentityResult.Success)
                {
                    await  _userManager.AddToRoleAsync(user, "Hoca");
                    await _userManager.AddClaimAsync(user, new Claim("Sistem Yöneticisi", "evet"));
                }
                else
                {
                    Console.WriteLine("Kullanıcı eklenirken hata oluştu!!!");
                    throw new InvalidOperationException("Failed to create default user");
                }
                Console.WriteLine("Kullanıcı eklendi...");
            }
        }


    }
}
