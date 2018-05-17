using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Migrations.SoruDepo
{
    public partial class SoruDepo_Baslangic : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Ogrenci");

            migrationBuilder.EnsureSchema(
                name: "Ders");

            migrationBuilder.EnsureSchema(
                name: "Soru");

            migrationBuilder.EnsureSchema(
                name: "Universite");

            migrationBuilder.EnsureSchema(
                name: "Kisi");

            migrationBuilder.EnsureSchema(
                name: "Personel");

            migrationBuilder.CreateTable(
                name: "AlanKodlari",
                schema: "Ders",
                columns: table => new
                {
                    AlanKodId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    AlanKodAdi = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlanKodlari", x => x.AlanKodId);
                });

            //migrationBuilder.CreateTable(
            //    name: "Cinsiyetler",
            //    schema: "Kisi",
            //    columns: table => new
            //    {
            //        CinsiyetId = table.Column<int>(nullable: false)
            //            .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
            //        CinsiyetAdi = table.Column<string>(nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Cinsiyetler", x => x.CinsiyetId);
            //    });

            //migrationBuilder.CreateTable(
            //    name: "MedeniHaller",
            //    schema: "Kisi",
            //    columns: table => new
            //    {
            //        MedeniHalId = table.Column<int>(nullable: false)
            //            .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
            //        MedeniHalAdi = table.Column<string>(nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_MedeniHaller", x => x.MedeniHalId);
            //    });

            migrationBuilder.CreateTable(
                name: "SoruBilisselDuzeyler",
                schema: "Soru",
                columns: table => new
                {
                    BilisselDuzeyId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Aktif = table.Column<bool>(nullable: true),
                    BilisselDuzyeAdi = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SoruBilisselDuzeyler", x => x.BilisselDuzeyId);
                });

            migrationBuilder.CreateTable(
                name: "SoruKokleri",
                schema: "Soru",
                columns: table => new
                {
                    SoruKokuId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    SoruKokuMetni = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SoruKokleri", x => x.SoruKokuId);
                });

            migrationBuilder.CreateTable(
                name: "SoruTipleri",
                schema: "Soru",
                columns: table => new
                {
                    SoruTipId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Aktif = table.Column<bool>(nullable: true),
                    SoruTipAdi = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SoruTipleri", x => x.SoruTipId);
                });

            migrationBuilder.CreateTable(
                name: "PozisyonGrupTanimlari",
                schema: "Universite",
                columns: table => new
                {
                    PozisyonGrupTanimId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    PozisyonGrupTanimAdi = table.Column<string>(nullable: true),
                    PozisyonGrupTanimKisaAdi = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PozisyonGrupTanimlari", x => x.PozisyonGrupTanimId);
                });

            migrationBuilder.CreateTable(
                name: "Pozisyonlar",
                schema: "Universite",
                columns: table => new
                {
                    PozisyonId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Akademik = table.Column<bool>(nullable: false),
                    AkademikGuc = table.Column<int>(nullable: false),
                    Idari = table.Column<bool>(nullable: false),
                    IdariGuc = table.Column<int>(nullable: false),
                    Kisaltmasi = table.Column<int>(nullable: false),
                    PozisyonAdi = table.Column<int>(nullable: false),
                    PozisyonKodu = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pozisyonlar", x => x.PozisyonId);
                });

            //migrationBuilder.CreateTable(
            //    name: "Kisiler",
            //    schema: "Kisi",
            //    columns: table => new
            //    {
            //        KisiId = table.Column<int>(nullable: false)
            //            .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
            //        Ad = table.Column<string>(nullable: true),
            //        CinsiyetNo = table.Column<int>(nullable: false),
            //        DogumTarihi = table.Column<DateTime>(nullable: false),
            //        IkinciAd = table.Column<string>(nullable: true),
            //        MedeniHalNo = table.Column<int>(nullable: false),
            //        Soyad = table.Column<string>(nullable: true),
            //        Unvan = table.Column<string>(nullable: true)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Kisiler", x => x.KisiId);
            //        table.ForeignKey(
            //            name: "FK_Kisiler_Cinsiyetler_CinsiyetNo",
            //            column: x => x.CinsiyetNo,
            //            principalSchema: "Kisi",
            //            principalTable: "Cinsiyetler",
            //            principalColumn: "CinsiyetId",
            //            onDelete: ReferentialAction.Cascade);
            //        table.ForeignKey(
            //            name: "FK_Kisiler_MedeniHaller_MedeniHalNo",
            //            column: x => x.MedeniHalNo,
            //            principalSchema: "Kisi",
            //            principalTable: "MedeniHaller",
            //            principalColumn: "MedeniHalId",
            //            onDelete: ReferentialAction.Cascade);
            //    });

            migrationBuilder.CreateTable(
                name: "BirimGruplari",
                schema: "Universite",
                columns: table => new
                {
                    BirimGrupId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Akademik = table.Column<int>(nullable: true),
                    AkademikAmirPozisyonNo = table.Column<int>(nullable: true),
                    AkademikGuc = table.Column<int>(nullable: true),
                    BirimGrupAdi = table.Column<int>(nullable: false),
                    Idari = table.Column<int>(nullable: true),
                    IdariAmirPozisyonNo = table.Column<int>(nullable: true),
                    IdariGuc = table.Column<int>(nullable: true),
                    UstBirimGrupNo = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BirimGruplari", x => x.BirimGrupId);
                    table.ForeignKey(
                        name: "FK_BirimGruplari_Pozisyonlar_AkademikAmirPozisyonNo",
                        column: x => x.AkademikAmirPozisyonNo,
                        principalSchema: "Universite",
                        principalTable: "Pozisyonlar",
                        principalColumn: "PozisyonId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BirimGruplari_Pozisyonlar_IdariAmirPozisyonNo",
                        column: x => x.IdariAmirPozisyonNo,
                        principalSchema: "Universite",
                        principalTable: "Pozisyonlar",
                        principalColumn: "PozisyonId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BirimGruplari_BirimGruplari_UstBirimGrupNo",
                        column: x => x.UstBirimGrupNo,
                        principalSchema: "Universite",
                        principalTable: "BirimGruplari",
                        principalColumn: "BirimGrupId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PozisyonGruplari",
                schema: "Universite",
                columns: table => new
                {
                    PozisyonNo = table.Column<int>(nullable: false),
                    PozisyonGrupTanimNo = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PozisyonGruplari", x => new { x.PozisyonNo, x.PozisyonGrupTanimNo });
                    table.ForeignKey(
                        name: "FK_PozisyonGruplari_PozisyonGrupTanimlari_PozisyonGrupTanimNo",
                        column: x => x.PozisyonGrupTanimNo,
                        principalSchema: "Universite",
                        principalTable: "PozisyonGrupTanimlari",
                        principalColumn: "PozisyonGrupTanimId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PozisyonGruplari_Pozisyonlar_PozisyonNo",
                        column: x => x.PozisyonNo,
                        principalSchema: "Universite",
                        principalTable: "Pozisyonlar",
                        principalColumn: "PozisyonId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Personeller",
                schema: "Personel",
                columns: table => new
                {
                    PersonelId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    KisiNo = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Personeller", x => x.PersonelId);
                    table.ForeignKey(
                        name: "FK_Personeller_Kisiler_KisiNo",
                        column: x => x.KisiNo,
                        principalSchema: "Kisi",
                        principalTable: "Kisiler",
                        principalColumn: "KisiId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Universiteler",
                schema: "Universite",
                columns: table => new
                {
                    UniversiteId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    AkademikAmirPersonelNo = table.Column<int>(nullable: true),
                    AkademikAmirPozisyonNo = table.Column<int>(nullable: true),
                    IdariAmirPersonelNo = table.Column<int>(nullable: true),
                    IdariAmirPozisyonNo = table.Column<int>(nullable: true),
                    UniversiteAdi = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Universiteler", x => x.UniversiteId);
                    table.ForeignKey(
                        name: "FK_Universiteler_Personeller_AkademikAmirPersonelNo",
                        column: x => x.AkademikAmirPersonelNo,
                        principalSchema: "Personel",
                        principalTable: "Personeller",
                        principalColumn: "PersonelId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Universiteler_Personeller_IdariAmirPersonelNo",
                        column: x => x.IdariAmirPersonelNo,
                        principalSchema: "Personel",
                        principalTable: "Personeller",
                        principalColumn: "PersonelId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AkademikTakvimler",
                schema: "Ogrenci",
                columns: table => new
                {
                    AkademikTakvimId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Baslangic = table.Column<DateTime>(nullable: false),
                    Bitis = table.Column<DateTime>(nullable: true),
                    UniversiteNo = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AkademikTakvimler", x => x.AkademikTakvimId);
                    table.ForeignKey(
                        name: "FK_AkademikTakvimler_Universiteler_UniversiteNo",
                        column: x => x.UniversiteNo,
                        principalSchema: "Universite",
                        principalTable: "Universiteler",
                        principalColumn: "UniversiteId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Birimler",
                schema: "Universite",
                columns: table => new
                {
                    BirimId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    AkademikAmirPersonelNo = table.Column<int>(nullable: true),
                    BagliBirimNo = table.Column<int>(nullable: true),
                    BirimAdi = table.Column<int>(nullable: false),
                    BirimGrupNo = table.Column<int>(nullable: false),
                    IdariAmirPersonelNo = table.Column<int>(nullable: true),
                    UniversiteNo = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Birimler", x => x.BirimId);
                    table.ForeignKey(
                        name: "FK_Birimler_Personeller_AkademikAmirPersonelNo",
                        column: x => x.AkademikAmirPersonelNo,
                        principalSchema: "Personel",
                        principalTable: "Personeller",
                        principalColumn: "PersonelId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Birimler_Birimler_BagliBirimNo",
                        column: x => x.BagliBirimNo,
                        principalSchema: "Universite",
                        principalTable: "Birimler",
                        principalColumn: "BirimId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Birimler_BirimGruplari_BirimGrupNo",
                        column: x => x.BirimGrupNo,
                        principalSchema: "Universite",
                        principalTable: "BirimGruplari",
                        principalColumn: "BirimGrupId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Birimler_Personeller_IdariAmirPersonelNo",
                        column: x => x.IdariAmirPersonelNo,
                        principalSchema: "Personel",
                        principalTable: "Personeller",
                        principalColumn: "PersonelId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Birimler_Universiteler_UniversiteNo",
                        column: x => x.UniversiteNo,
                        principalSchema: "Universite",
                        principalTable: "Universiteler",
                        principalColumn: "UniversiteId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Programlar",
                schema: "Ogrenci",
                columns: table => new
                {
                    ProgramId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    BirimAdi = table.Column<string>(nullable: true),
                    BirimNo = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Programlar", x => x.ProgramId);
                    table.ForeignKey(
                        name: "FK_Programlar_Birimler_BirimNo",
                        column: x => x.BirimNo,
                        principalSchema: "Universite",
                        principalTable: "Birimler",
                        principalColumn: "BirimId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BirimPersonelleri",
                schema: "Universite",
                columns: table => new
                {
                    BirimPersonelId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Baslangic = table.Column<DateTime>(nullable: false),
                    BirimNo = table.Column<int>(nullable: false),
                    Bitis = table.Column<DateTime>(nullable: true),
                    PersonelNo = table.Column<int>(nullable: true),
                    PozisyonNo = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BirimPersonelleri", x => x.BirimPersonelId);
                    table.ForeignKey(
                        name: "FK_BirimPersonelleri_Birimler_BirimNo",
                        column: x => x.BirimNo,
                        principalSchema: "Universite",
                        principalTable: "Birimler",
                        principalColumn: "BirimId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BirimPersonelleri_Personeller_PersonelNo",
                        column: x => x.PersonelNo,
                        principalSchema: "Personel",
                        principalTable: "Personeller",
                        principalColumn: "PersonelId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BirimPersonelleri_Pozisyonlar_PozisyonNo",
                        column: x => x.PozisyonNo,
                        principalSchema: "Universite",
                        principalTable: "Pozisyonlar",
                        principalColumn: "PozisyonId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProgramDonemleri",
                schema: "Ogrenci",
                columns: table => new
                {
                    ProgramDonemId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Aktif = table.Column<int>(nullable: false),
                    DonemAdi = table.Column<string>(nullable: true),
                    DonemNo = table.Column<int>(nullable: false),
                    ProgramNo = table.Column<int>(nullable: false),
                    Sinifi = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProgramDonemleri", x => x.ProgramDonemId);
                    table.ForeignKey(
                        name: "FK_ProgramDonemleri_Programlar_ProgramNo",
                        column: x => x.ProgramNo,
                        principalSchema: "Ogrenci",
                        principalTable: "Programlar",
                        principalColumn: "ProgramId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DonemDersGruplari",
                schema: "Ogrenci",
                columns: table => new
                {
                    DonemDersGrupId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    DersKurulu = table.Column<bool>(nullable: false),
                    GrupAdi = table.Column<string>(nullable: true),
                    ProgramDonemNo = table.Column<int>(nullable: false),
                    Staj = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DonemDersGruplari", x => x.DonemDersGrupId);
                    table.ForeignKey(
                        name: "FK_DonemDersGruplari_ProgramDonemleri_ProgramDonemNo",
                        column: x => x.ProgramDonemNo,
                        principalSchema: "Ogrenci",
                        principalTable: "ProgramDonemleri",
                        principalColumn: "ProgramDonemId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProgramAkademikTakvimleri",
                schema: "Ogrenci",
                columns: table => new
                {
                    ProgramAkademikTakvimId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Aciklama = table.Column<string>(nullable: true),
                    AkademikTakvimNo = table.Column<int>(nullable: false),
                    Baslangic = table.Column<DateTime>(nullable: false),
                    Bitis = table.Column<DateTime>(nullable: true),
                    DonemNo = table.Column<int>(nullable: false),
                    DonemiProgramDonemId = table.Column<int>(nullable: true),
                    ProgramNo = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProgramAkademikTakvimleri", x => x.ProgramAkademikTakvimId);
                    table.ForeignKey(
                        name: "FK_ProgramAkademikTakvimleri_AkademikTakvimler_AkademikTakvimNo",
                        column: x => x.AkademikTakvimNo,
                        principalSchema: "Ogrenci",
                        principalTable: "AkademikTakvimler",
                        principalColumn: "AkademikTakvimId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProgramAkademikTakvimleri_ProgramDonemleri_DonemiProgramDonemId",
                        column: x => x.DonemiProgramDonemId,
                        principalSchema: "Ogrenci",
                        principalTable: "ProgramDonemleri",
                        principalColumn: "ProgramDonemId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Dersler",
                schema: "Ders",
                columns: table => new
                {
                    DersId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    AlanKodNo = table.Column<int>(nullable: false),
                    DersAdi = table.Column<string>(nullable: true),
                    DonemDersGrupNo = table.Column<int>(nullable: false),
                    HaftalikHesaplanacak = table.Column<int>(nullable: false),
                    KuramsalSaat = table.Column<int>(nullable: false),
                    UygulamaSaati = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dersler", x => x.DersId);
                    table.ForeignKey(
                        name: "FK_Dersler_AlanKodlari_AlanKodNo",
                        column: x => x.AlanKodNo,
                        principalSchema: "Ders",
                        principalTable: "AlanKodlari",
                        principalColumn: "AlanKodId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Dersler_DonemDersGruplari_DonemDersGrupNo",
                        column: x => x.DonemDersGrupNo,
                        principalSchema: "Ogrenci",
                        principalTable: "DonemDersGruplari",
                        principalColumn: "DonemDersGrupId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Konular",
                schema: "Ders",
                columns: table => new
                {
                    KonuId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    DersNo = table.Column<int>(nullable: false),
                    KonuAdi = table.Column<string>(nullable: true),
                    KuramsalSaati = table.Column<int>(nullable: false),
                    UygualamaSaati = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Konular", x => x.KonuId);
                    table.ForeignKey(
                        name: "FK_Konular_Dersler_DersNo",
                        column: x => x.DersNo,
                        principalSchema: "Ders",
                        principalTable: "Dersler",
                        principalColumn: "DersId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DonemDersleri",
                schema: "Ogrenci",
                columns: table => new
                {
                    DonemDersId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    DersId = table.Column<int>(nullable: true),
                    DersNo = table.Column<int>(nullable: false),
                    ProgramDonemNo = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DonemDersleri", x => x.DonemDersId);
                    table.ForeignKey(
                        name: "FK_DonemDersleri_Dersler_DersId",
                        column: x => x.DersId,
                        principalSchema: "Ders",
                        principalTable: "Dersler",
                        principalColumn: "DersId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DonemDersleri_ProgramDonemleri_ProgramDonemNo",
                        column: x => x.ProgramDonemNo,
                        principalSchema: "Ogrenci",
                        principalTable: "ProgramDonemleri",
                        principalColumn: "ProgramDonemId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DersKonuOgrenimHedefleri",
                schema: "Ders",
                columns: table => new
                {
                    OgrenimHedefId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Baslangic = table.Column<DateTime>(nullable: false),
                    Bitis = table.Column<DateTime>(nullable: true),
                    DersNo = table.Column<int>(nullable: true),
                    KonuNo = table.Column<int>(nullable: true),
                    OgrenimHedefAdi = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DersKonuOgrenimHedefleri", x => x.OgrenimHedefId);
                    table.ForeignKey(
                        name: "FK_DersKonuOgrenimHedefleri_Dersler_DersNo",
                        column: x => x.DersNo,
                        principalSchema: "Ders",
                        principalTable: "Dersler",
                        principalColumn: "DersId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DersKonuOgrenimHedefleri_Konular_KonuNo",
                        column: x => x.KonuNo,
                        principalSchema: "Ders",
                        principalTable: "Konular",
                        principalColumn: "KonuId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DersiAnlatanHocalar",
                schema: "Ogrenci",
                columns: table => new
                {
                    DersHocaId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    DersNo = table.Column<int>(nullable: true),
                    KonuNo = table.Column<int>(nullable: true),
                    KuramsalSaati = table.Column<int>(nullable: false),
                    PersonelNo = table.Column<int>(nullable: true),
                    UygualamaSaati = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DersiAnlatanHocalar", x => x.DersHocaId);
                    table.ForeignKey(
                        name: "FK_DersiAnlatanHocalar_Dersler_DersNo",
                        column: x => x.DersNo,
                        principalSchema: "Ders",
                        principalTable: "Dersler",
                        principalColumn: "DersId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DersiAnlatanHocalar_Konular_KonuNo",
                        column: x => x.KonuNo,
                        principalSchema: "Ders",
                        principalTable: "Konular",
                        principalColumn: "KonuId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DersiAnlatanHocalar_Personeller_PersonelNo",
                        column: x => x.PersonelNo,
                        principalSchema: "Personel",
                        principalTable: "Personeller",
                        principalColumn: "PersonelId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Sorular",
                schema: "Soru",
                columns: table => new
                {
                    SoruId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Aciklama = table.Column<string>(nullable: true),
                    AnahtarKelimeler = table.Column<string>(nullable: true),
                    Baslangic = table.Column<DateTime>(nullable: false),
                    BilisselDuzeyNo = table.Column<int>(nullable: true),
                    Bitis = table.Column<DateTime>(nullable: false),
                    CevaplamaSuresi = table.Column<int>(nullable: false),
                    DersNo = table.Column<int>(nullable: true),
                    HemenElenebilirSecenekSayisi = table.Column<int>(nullable: false),
                    KabulEdilebilirlikIndeksi = table.Column<int>(nullable: false),
                    KonuNo = table.Column<int>(nullable: true),
                    SecenekSayisi = table.Column<int>(nullable: false),
                    SoruAdi = table.Column<string>(nullable: true),
                    SoruKokuNo = table.Column<int>(nullable: true),
                    SoruMetni = table.Column<string>(nullable: true),
                    SoruTipNo = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sorular", x => x.SoruId);
                    table.ForeignKey(
                        name: "FK_Sorular_SoruBilisselDuzeyler_BilisselDuzeyNo",
                        column: x => x.BilisselDuzeyNo,
                        principalSchema: "Soru",
                        principalTable: "SoruBilisselDuzeyler",
                        principalColumn: "BilisselDuzeyId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Sorular_Dersler_DersNo",
                        column: x => x.DersNo,
                        principalSchema: "Ders",
                        principalTable: "Dersler",
                        principalColumn: "DersId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Sorular_Konular_KonuNo",
                        column: x => x.KonuNo,
                        principalSchema: "Ders",
                        principalTable: "Konular",
                        principalColumn: "KonuId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Sorular_SoruKokleri_SoruKokuNo",
                        column: x => x.SoruKokuNo,
                        principalSchema: "Soru",
                        principalTable: "SoruKokleri",
                        principalColumn: "SoruKokuId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Sorular_SoruTipleri_SoruTipNo",
                        column: x => x.SoruTipNo,
                        principalSchema: "Soru",
                        principalTable: "SoruTipleri",
                        principalColumn: "SoruTipId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SoruOgrenimHedefleri",
                schema: "Soru",
                columns: table => new
                {
                    SoruNo = table.Column<int>(nullable: false),
                    OgrenimHedefNo = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SoruOgrenimHedefleri", x => new { x.SoruNo, x.OgrenimHedefNo });
                    table.ForeignKey(
                        name: "FK_SoruOgrenimHedefleri_Sorular_OgrenimHedefNo",
                        column: x => x.OgrenimHedefNo,
                        principalSchema: "Soru",
                        principalTable: "Sorular",
                        principalColumn: "SoruId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SoruOgrenimHedefleri_DersKonuOgrenimHedefleri_SoruNo",
                        column: x => x.SoruNo,
                        principalSchema: "Ders",
                        principalTable: "DersKonuOgrenimHedefleri",
                        principalColumn: "OgrenimHedefId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TekDoguruluSoruSecenekleri",
                schema: "Soru",
                columns: table => new
                {
                    TekDogruluSoruSecenekId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    DogruSecenek = table.Column<bool>(nullable: false),
                    SecenekMetni = table.Column<string>(nullable: true),
                    SoruNo = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TekDoguruluSoruSecenekleri", x => x.TekDogruluSoruSecenekId);
                    table.ForeignKey(
                        name: "FK_TekDoguruluSoruSecenekleri_Sorular_SoruNo",
                        column: x => x.SoruNo,
                        principalSchema: "Soru",
                        principalTable: "Sorular",
                        principalColumn: "SoruId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DersKonuOgrenimHedefleri_DersNo",
                schema: "Ders",
                table: "DersKonuOgrenimHedefleri",
                column: "DersNo");

            migrationBuilder.CreateIndex(
                name: "IX_DersKonuOgrenimHedefleri_KonuNo",
                schema: "Ders",
                table: "DersKonuOgrenimHedefleri",
                column: "KonuNo");

            migrationBuilder.CreateIndex(
                name: "IX_Dersler_AlanKodNo",
                schema: "Ders",
                table: "Dersler",
                column: "AlanKodNo");

            migrationBuilder.CreateIndex(
                name: "IX_Dersler_DonemDersGrupNo",
                schema: "Ders",
                table: "Dersler",
                column: "DonemDersGrupNo");

            migrationBuilder.CreateIndex(
                name: "IX_Konular_DersNo",
                schema: "Ders",
                table: "Konular",
                column: "DersNo");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Kisiler_CinsiyetNo",
            //    schema: "Kisi",
            //    table: "Kisiler",
            //    column: "CinsiyetNo");

            //migrationBuilder.CreateIndex(
            //    name: "IX_Kisiler_MedeniHalNo",
            //    schema: "Kisi",
            //    table: "Kisiler",
            //    column: "MedeniHalNo");

            migrationBuilder.CreateIndex(
                name: "IX_AkademikTakvimler_UniversiteNo",
                schema: "Ogrenci",
                table: "AkademikTakvimler",
                column: "UniversiteNo");

            migrationBuilder.CreateIndex(
                name: "IX_DersiAnlatanHocalar_DersNo",
                schema: "Ogrenci",
                table: "DersiAnlatanHocalar",
                column: "DersNo");

            migrationBuilder.CreateIndex(
                name: "IX_DersiAnlatanHocalar_KonuNo",
                schema: "Ogrenci",
                table: "DersiAnlatanHocalar",
                column: "KonuNo");

            migrationBuilder.CreateIndex(
                name: "IX_DersiAnlatanHocalar_PersonelNo",
                schema: "Ogrenci",
                table: "DersiAnlatanHocalar",
                column: "PersonelNo");

            migrationBuilder.CreateIndex(
                name: "IX_DonemDersGruplari_ProgramDonemNo",
                schema: "Ogrenci",
                table: "DonemDersGruplari",
                column: "ProgramDonemNo");

            migrationBuilder.CreateIndex(
                name: "IX_DonemDersleri_DersId",
                schema: "Ogrenci",
                table: "DonemDersleri",
                column: "DersId");

            migrationBuilder.CreateIndex(
                name: "IX_DonemDersleri_ProgramDonemNo",
                schema: "Ogrenci",
                table: "DonemDersleri",
                column: "ProgramDonemNo");

            migrationBuilder.CreateIndex(
                name: "IX_ProgramAkademikTakvimleri_AkademikTakvimNo",
                schema: "Ogrenci",
                table: "ProgramAkademikTakvimleri",
                column: "AkademikTakvimNo");

            migrationBuilder.CreateIndex(
                name: "IX_ProgramAkademikTakvimleri_DonemiProgramDonemId",
                schema: "Ogrenci",
                table: "ProgramAkademikTakvimleri",
                column: "DonemiProgramDonemId");

            migrationBuilder.CreateIndex(
                name: "IX_ProgramDonemleri_ProgramNo",
                schema: "Ogrenci",
                table: "ProgramDonemleri",
                column: "ProgramNo");

            migrationBuilder.CreateIndex(
                name: "IX_Programlar_BirimNo",
                schema: "Ogrenci",
                table: "Programlar",
                column: "BirimNo");

            migrationBuilder.CreateIndex(
                name: "IX_Personeller_KisiNo",
                schema: "Personel",
                table: "Personeller",
                column: "KisiNo");

            migrationBuilder.CreateIndex(
                name: "IX_Sorular_BilisselDuzeyNo",
                schema: "Soru",
                table: "Sorular",
                column: "BilisselDuzeyNo");

            migrationBuilder.CreateIndex(
                name: "IX_Sorular_DersNo",
                schema: "Soru",
                table: "Sorular",
                column: "DersNo");

            migrationBuilder.CreateIndex(
                name: "IX_Sorular_KonuNo",
                schema: "Soru",
                table: "Sorular",
                column: "KonuNo");

            migrationBuilder.CreateIndex(
                name: "IX_Sorular_SoruKokuNo",
                schema: "Soru",
                table: "Sorular",
                column: "SoruKokuNo");

            migrationBuilder.CreateIndex(
                name: "IX_Sorular_SoruTipNo",
                schema: "Soru",
                table: "Sorular",
                column: "SoruTipNo");

            migrationBuilder.CreateIndex(
                name: "IX_SoruOgrenimHedefleri_OgrenimHedefNo",
                schema: "Soru",
                table: "SoruOgrenimHedefleri",
                column: "OgrenimHedefNo");

            migrationBuilder.CreateIndex(
                name: "IX_TekDoguruluSoruSecenekleri_SoruNo",
                schema: "Soru",
                table: "TekDoguruluSoruSecenekleri",
                column: "SoruNo");

            migrationBuilder.CreateIndex(
                name: "IX_BirimGruplari_AkademikAmirPozisyonNo",
                schema: "Universite",
                table: "BirimGruplari",
                column: "AkademikAmirPozisyonNo");

            migrationBuilder.CreateIndex(
                name: "IX_BirimGruplari_IdariAmirPozisyonNo",
                schema: "Universite",
                table: "BirimGruplari",
                column: "IdariAmirPozisyonNo");

            migrationBuilder.CreateIndex(
                name: "IX_BirimGruplari_UstBirimGrupNo",
                schema: "Universite",
                table: "BirimGruplari",
                column: "UstBirimGrupNo");

            migrationBuilder.CreateIndex(
                name: "IX_Birimler_AkademikAmirPersonelNo",
                schema: "Universite",
                table: "Birimler",
                column: "AkademikAmirPersonelNo");

            migrationBuilder.CreateIndex(
                name: "IX_Birimler_BagliBirimNo",
                schema: "Universite",
                table: "Birimler",
                column: "BagliBirimNo");

            migrationBuilder.CreateIndex(
                name: "IX_Birimler_BirimGrupNo",
                schema: "Universite",
                table: "Birimler",
                column: "BirimGrupNo");

            migrationBuilder.CreateIndex(
                name: "IX_Birimler_IdariAmirPersonelNo",
                schema: "Universite",
                table: "Birimler",
                column: "IdariAmirPersonelNo");

            migrationBuilder.CreateIndex(
                name: "IX_Birimler_UniversiteNo",
                schema: "Universite",
                table: "Birimler",
                column: "UniversiteNo");

            migrationBuilder.CreateIndex(
                name: "IX_BirimPersonelleri_BirimNo",
                schema: "Universite",
                table: "BirimPersonelleri",
                column: "BirimNo");

            migrationBuilder.CreateIndex(
                name: "IX_BirimPersonelleri_PersonelNo",
                schema: "Universite",
                table: "BirimPersonelleri",
                column: "PersonelNo");

            migrationBuilder.CreateIndex(
                name: "IX_BirimPersonelleri_PozisyonNo",
                schema: "Universite",
                table: "BirimPersonelleri",
                column: "PozisyonNo");

            migrationBuilder.CreateIndex(
                name: "IX_PozisyonGruplari_PozisyonGrupTanimNo",
                schema: "Universite",
                table: "PozisyonGruplari",
                column: "PozisyonGrupTanimNo");

            migrationBuilder.CreateIndex(
                name: "IX_Universiteler_AkademikAmirPersonelNo",
                schema: "Universite",
                table: "Universiteler",
                column: "AkademikAmirPersonelNo");

            migrationBuilder.CreateIndex(
                name: "IX_Universiteler_IdariAmirPersonelNo",
                schema: "Universite",
                table: "Universiteler",
                column: "IdariAmirPersonelNo");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DersiAnlatanHocalar",
                schema: "Ogrenci");

            migrationBuilder.DropTable(
                name: "DonemDersleri",
                schema: "Ogrenci");

            migrationBuilder.DropTable(
                name: "ProgramAkademikTakvimleri",
                schema: "Ogrenci");

            migrationBuilder.DropTable(
                name: "SoruOgrenimHedefleri",
                schema: "Soru");

            migrationBuilder.DropTable(
                name: "TekDoguruluSoruSecenekleri",
                schema: "Soru");

            migrationBuilder.DropTable(
                name: "BirimPersonelleri",
                schema: "Universite");

            migrationBuilder.DropTable(
                name: "PozisyonGruplari",
                schema: "Universite");

            migrationBuilder.DropTable(
                name: "AkademikTakvimler",
                schema: "Ogrenci");

            migrationBuilder.DropTable(
                name: "DersKonuOgrenimHedefleri",
                schema: "Ders");

            migrationBuilder.DropTable(
                name: "Sorular",
                schema: "Soru");

            migrationBuilder.DropTable(
                name: "PozisyonGrupTanimlari",
                schema: "Universite");

            migrationBuilder.DropTable(
                name: "SoruBilisselDuzeyler",
                schema: "Soru");

            migrationBuilder.DropTable(
                name: "Konular",
                schema: "Ders");

            migrationBuilder.DropTable(
                name: "SoruKokleri",
                schema: "Soru");

            migrationBuilder.DropTable(
                name: "SoruTipleri",
                schema: "Soru");

            migrationBuilder.DropTable(
                name: "Dersler",
                schema: "Ders");

            migrationBuilder.DropTable(
                name: "AlanKodlari",
                schema: "Ders");

            migrationBuilder.DropTable(
                name: "DonemDersGruplari",
                schema: "Ogrenci");

            migrationBuilder.DropTable(
                name: "ProgramDonemleri",
                schema: "Ogrenci");

            migrationBuilder.DropTable(
                name: "Programlar",
                schema: "Ogrenci");

            migrationBuilder.DropTable(
                name: "Birimler",
                schema: "Universite");

            migrationBuilder.DropTable(
                name: "BirimGruplari",
                schema: "Universite");

            migrationBuilder.DropTable(
                name: "Universiteler",
                schema: "Universite");

            migrationBuilder.DropTable(
                name: "Pozisyonlar",
                schema: "Universite");

            migrationBuilder.DropTable(
                name: "Personeller",
                schema: "Personel");

            //migrationBuilder.DropTable(
            //    name: "Kisiler",
            //    schema: "Kisi");

            //migrationBuilder.DropTable(
            //    name: "Cinsiyetler",
            //    schema: "Kisi");

            //migrationBuilder.DropTable(
            //    name: "MedeniHaller",
            //    schema: "Kisi");
        }
    }
}
