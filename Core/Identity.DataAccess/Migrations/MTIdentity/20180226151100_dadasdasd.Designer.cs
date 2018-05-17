﻿// <auto-generated />
using Identity.DataAccess;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.Internal;
using System;

namespace Identity.DataAccess.Migrations.MTIdentity
{
    [DbContext(typeof(MTIdentityDbContext))]
    [Migration("20180226151100_dadasdasd")]
    partial class dadasdasd
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasDefaultSchema("Yetki")
                .HasAnnotation("ProductVersion", "2.0.1-rtm-125")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Identity.DataAccess.ArkadaslikTeklif", b =>
                {
                    b.Property<int>("TeklifEdenNo");

                    b.Property<int>("TeklifEdilenNo");

                    b.Property<DateTime?>("CevapTarihi");

                    b.Property<int?>("IptalEdenKullaniciNo");

                    b.Property<bool?>("IptalEdildi");

                    b.Property<DateTime?>("IptalTarihi");

                    b.Property<DateTime>("IstekTarihi");

                    b.Property<bool?>("Karar");

                    b.HasKey("TeklifEdenNo", "TeklifEdilenNo");

                    b.HasIndex("TeklifEdilenNo");

                    b.ToTable("ArkadaslikTeklifleri");
                });

            modelBuilder.Entity("Identity.DataAccess.KisiCinsiyet", b =>
                {
                    b.Property<int>("CinsiyetId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("CinsiyetAdi");

                    b.HasKey("CinsiyetId");

                    b.ToTable("Cinsiyetler","Kisi");
                });

            modelBuilder.Entity("Identity.DataAccess.KisiFoto", b =>
                {
                    b.Property<int>("FotoId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Aciklama");

                    b.Property<string>("DisKaynakId");

                    b.Property<string>("DosyaAdi");

                    b.Property<DateTime>("EklenmeTarihi");

                    b.Property<int>("KisiNo");

                    b.Property<bool>("ProfilFotografi");

                    b.Property<string>("PublicId");

                    b.Property<string>("Url");

                    b.HasKey("FotoId");

                    b.HasIndex("KisiNo");

                    b.ToTable("KisiFotograflari","Kisi");
                });

            modelBuilder.Entity("Identity.DataAccess.Kullanici", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("AccessFailedCount");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Email")
                        .HasMaxLength(256);

                    b.Property<bool>("EmailConfirmed");

                    b.Property<long?>("FacebookId");

                    b.Property<int?>("KisiNo");

                    b.Property<bool>("LockoutEnabled");

                    b.Property<DateTimeOffset?>("LockoutEnd");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256);

                    b.Property<bool>("Pasif");

                    b.Property<string>("PasswordHash");

                    b.Property<string>("PhoneNumber");

                    b.Property<bool>("PhoneNumberConfirmed");

                    b.Property<string>("SecurityStamp");

                    b.Property<DateTime?>("SonAktifOlmaTarihi");

                    b.Property<bool>("TwoFactorEnabled");

                    b.Property<string>("UserName")
                        .HasMaxLength(256);

                    b.Property<DateTime>("YaratilmaTarihi");

                    b.Property<bool>("Yonetici")
                        .HasMaxLength(250);

                    b.HasKey("Id");

                    b.HasIndex("KisiNo");

                    b.HasIndex("NormalizedEmail")
                        .HasName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.ToTable("Kullanicilar");
                });

            modelBuilder.Entity("Identity.DataAccess.KullaniciKisi", b =>
                {
                    b.Property<int>("KisiId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Ad")
                        .HasMaxLength(50);

                    b.Property<int?>("CinsiyetNo");

                    b.Property<string>("DigerAd");

                    b.Property<DateTime>("DogumTarihi");

                    b.Property<int?>("MedeniHalNo");

                    b.Property<string>("Soyad")
                        .HasMaxLength(50);

                    b.Property<string>("Unvan")
                        .HasMaxLength(15);

                    b.HasKey("KisiId");

                    b.HasIndex("CinsiyetNo");

                    b.HasIndex("MedeniHalNo");

                    b.HasIndex("Ad", "Soyad", "DogumTarihi", "CinsiyetNo")
                        .IsUnique()
                        .HasName("KisiAdSoyadDogumTarihiCinsiyetIndeks")
                        .HasFilter("[Ad] IS NOT NULL AND [Soyad] IS NOT NULL AND [CinsiyetNo] IS NOT NULL");

                    b.ToTable("Kisiler","Kisi");
                });

            modelBuilder.Entity("Identity.DataAccess.MedeniHal", b =>
                {
                    b.Property<int>("MedeniHalId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("MedeniHalAdi");

                    b.HasKey("MedeniHalId");

                    b.ToTable("MedeniHaller","Kisi");
                });

            modelBuilder.Entity("Identity.DataAccess.Mesaj", b =>
                {
                    b.Property<int>("MesajId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("AlanNo");

                    b.Property<bool>("AlanSildi");

                    b.Property<int>("GonderenNo");

                    b.Property<bool>("GonderenSildi");

                    b.Property<DateTime?>("GonderilmeZamani");

                    b.Property<string>("Icerik");

                    b.Property<bool>("Okundu");

                    b.Property<DateTime?>("OkunmaZamani");

                    b.HasKey("MesajId");

                    b.HasIndex("AlanNo");

                    b.HasIndex("GonderenNo");

                    b.ToTable("Mesajlasmalar");
                });

            modelBuilder.Entity("Identity.DataAccess.Rol", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Description")
                        .HasMaxLength(250);

                    b.Property<string>("Name")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.ToTable("Roller");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<int>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<int>("RoleId");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("RolHaklari");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<int>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<int>("UserId");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("KullaniciHaklari");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<int>", b =>
                {
                    b.Property<string>("LoginProvider");

                    b.Property<string>("ProviderKey");

                    b.Property<string>("ProviderDisplayName");

                    b.Property<int>("UserId");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("KullaniciGirisleri");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<int>", b =>
                {
                    b.Property<int>("UserId");

                    b.Property<int>("RoleId");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("KullaniciRolleri");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<int>", b =>
                {
                    b.Property<int>("UserId");

                    b.Property<string>("LoginProvider");

                    b.Property<string>("Name");

                    b.Property<string>("Value");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("KullaniciBiletleri");
                });

            modelBuilder.Entity("Identity.DataAccess.ArkadaslikTeklif", b =>
                {
                    b.HasOne("Identity.DataAccess.Kullanici", "TeklifEden")
                        .WithMany("GelenTeklifler")
                        .HasForeignKey("TeklifEdenNo")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Identity.DataAccess.Kullanici", "TeklifEdilen")
                        .WithMany("YapilanTeklifler")
                        .HasForeignKey("TeklifEdilenNo")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Identity.DataAccess.KisiFoto", b =>
                {
                    b.HasOne("Identity.DataAccess.KullaniciKisi", "Kisi")
                        .WithMany("Fotograflari")
                        .HasForeignKey("KisiNo")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Identity.DataAccess.Kullanici", b =>
                {
                    b.HasOne("Identity.DataAccess.KullaniciKisi", "Kisi")
                        .WithMany("Kullanicilari")
                        .HasForeignKey("KisiNo");
                });

            modelBuilder.Entity("Identity.DataAccess.KullaniciKisi", b =>
                {
                    b.HasOne("Identity.DataAccess.KisiCinsiyet", "Cinsiyeti")
                        .WithMany("Kisileri")
                        .HasForeignKey("CinsiyetNo");

                    b.HasOne("Identity.DataAccess.MedeniHal", "MedeniHali")
                        .WithMany("Kisileri")
                        .HasForeignKey("MedeniHalNo");
                });

            modelBuilder.Entity("Identity.DataAccess.Mesaj", b =>
                {
                    b.HasOne("Identity.DataAccess.Kullanici", "Alan")
                        .WithMany("AldigiMesajlar")
                        .HasForeignKey("AlanNo")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("Identity.DataAccess.Kullanici", "Gonderen")
                        .WithMany("GonderdigiMesajlar")
                        .HasForeignKey("GonderenNo")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<int>", b =>
                {
                    b.HasOne("Identity.DataAccess.Rol")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<int>", b =>
                {
                    b.HasOne("Identity.DataAccess.Kullanici")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<int>", b =>
                {
                    b.HasOne("Identity.DataAccess.Kullanici")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<int>", b =>
                {
                    b.HasOne("Identity.DataAccess.Rol")
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Identity.DataAccess.Kullanici")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<int>", b =>
                {
                    b.HasOne("Identity.DataAccess.Kullanici")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
