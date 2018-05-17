using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace Identity.DataAccess.Migrations.MTIdentity
{
    public partial class Baslangic : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Yetki");

            migrationBuilder.EnsureSchema(
                name: "Kisi");

            migrationBuilder.CreateTable(
                name: "Cinsiyetler",
                schema: "Kisi",
                columns: table => new
                {
                    CinsiyetId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CinsiyetAdi = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cinsiyetler", x => x.CinsiyetId);
                });

            migrationBuilder.CreateTable(
                name: "MedeniHaller",
                schema: "Kisi",
                columns: table => new
                {
                    MedeniHalId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    MedeniHalAdi = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedeniHaller", x => x.MedeniHalId);
                });

            migrationBuilder.CreateTable(
                name: "Roller",
                schema: "Yetki",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    Description = table.Column<string>(maxLength: 250, nullable: true),
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(maxLength: 256, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roller", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Kisiler",
                schema: "Kisi",
                columns: table => new
                {
                    KisiId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Ad = table.Column<string>(maxLength: 50, nullable: true),
                    CinsiyetNo = table.Column<int>(nullable: false),
                    DigerAd = table.Column<string>(nullable: true),
                    DogumTarihi = table.Column<DateTime>(nullable: false),
                    MedeniHalNo = table.Column<int>(nullable: true),
                    Soyad = table.Column<string>(maxLength: 50, nullable: true),
                    Unvan = table.Column<string>(maxLength: 15, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kisiler", x => x.KisiId);
                    table.ForeignKey(
                        name: "FK_Kisiler_Cinsiyetler_CinsiyetNo",
                        column: x => x.CinsiyetNo,
                        principalSchema: "Kisi",
                        principalTable: "Cinsiyetler",
                        principalColumn: "CinsiyetId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Kisiler_MedeniHaller_MedeniHalNo",
                        column: x => x.MedeniHalNo,
                        principalSchema: "Kisi",
                        principalTable: "MedeniHaller",
                        principalColumn: "MedeniHalId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RolHaklari",
                schema: "Yetki",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true),
                    RoleId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RolHaklari", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RolHaklari_Roller_RoleId",
                        column: x => x.RoleId,
                        principalSchema: "Yetki",
                        principalTable: "Roller",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "KisiFotograflari",
                schema: "Kisi",
                columns: table => new
                {
                    FotoId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Aciklama = table.Column<string>(nullable: true),
                    DosyaAdi = table.Column<string>(nullable: true),
                    EklenmeTarihi = table.Column<DateTime>(nullable: false),
                    Id = table.Column<int>(nullable: false),
                    KisiNo = table.Column<int>(nullable: false),
                    ProfilFotografi = table.Column<bool>(nullable: false),
                    PublicId = table.Column<string>(nullable: true),
                    Url = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KisiFotograflari", x => x.FotoId);
                    table.ForeignKey(
                        name: "FK_KisiFotograflari_Kisiler_KisiNo",
                        column: x => x.KisiNo,
                        principalSchema: "Kisi",
                        principalTable: "Kisiler",
                        principalColumn: "KisiId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Kullanicilar",
                schema: "Yetki",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    AccessFailedCount = table.Column<int>(nullable: false),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    Email = table.Column<string>(maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(nullable: false),
                    KisiNo = table.Column<int>(nullable: true),
                    LockoutEnabled = table.Column<bool>(nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(nullable: true),
                    NormalizedEmail = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(maxLength: 256, nullable: true),
                    Pasif = table.Column<bool>(nullable: false),
                    PasswordHash = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(nullable: false),
                    SecurityStamp = table.Column<string>(nullable: true),
                    SonAktifOlmaTarihi = table.Column<DateTime>(nullable: true),
                    TwoFactorEnabled = table.Column<bool>(nullable: false),
                    UserName = table.Column<string>(maxLength: 256, nullable: true),
                    YaratilmaTarihi = table.Column<DateTime>(nullable: false),
                    Yonetici = table.Column<bool>(maxLength: 250, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kullanicilar", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Kullanicilar_Kisiler_KisiNo",
                        column: x => x.KisiNo,
                        principalSchema: "Kisi",
                        principalTable: "Kisiler",
                        principalColumn: "KisiId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ArkadaslikTeklifleri",
                schema: "Yetki",
                columns: table => new
                {
                    TeklifEdenNo = table.Column<int>(nullable: false),
                    TeklifEdilenNo = table.Column<int>(nullable: false),
                    CevapTarihi = table.Column<DateTime>(nullable: true),
                    Id = table.Column<int>(nullable: false),
                    IstekTarihi = table.Column<DateTime>(nullable: false),
                    Karar = table.Column<bool>(nullable: true),
                    Kimlik = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArkadaslikTeklifleri", x => new { x.TeklifEdenNo, x.TeklifEdilenNo });
                    table.ForeignKey(
                        name: "FK_ArkadaslikTeklifleri_Kullanicilar_TeklifEdenNo",
                        column: x => x.TeklifEdenNo,
                        principalSchema: "Yetki",
                        principalTable: "Kullanicilar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ArkadaslikTeklifleri_Kullanicilar_TeklifEdilenNo",
                        column: x => x.TeklifEdilenNo,
                        principalSchema: "Yetki",
                        principalTable: "Kullanicilar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "KullaniciBiletleri",
                schema: "Yetki",
                columns: table => new
                {
                    UserId = table.Column<int>(nullable: false),
                    LoginProvider = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KullaniciBiletleri", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_KullaniciBiletleri_Kullanicilar_UserId",
                        column: x => x.UserId,
                        principalSchema: "Yetki",
                        principalTable: "Kullanicilar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "KullaniciGirisleri",
                schema: "Yetki",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(nullable: false),
                    ProviderKey = table.Column<string>(nullable: false),
                    ProviderDisplayName = table.Column<string>(nullable: true),
                    UserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KullaniciGirisleri", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_KullaniciGirisleri_Kullanicilar_UserId",
                        column: x => x.UserId,
                        principalSchema: "Yetki",
                        principalTable: "Kullanicilar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "KullaniciHaklari",
                schema: "Yetki",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true),
                    UserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KullaniciHaklari", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KullaniciHaklari_Kullanicilar_UserId",
                        column: x => x.UserId,
                        principalSchema: "Yetki",
                        principalTable: "Kullanicilar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "KullaniciRolleri",
                schema: "Yetki",
                columns: table => new
                {
                    UserId = table.Column<int>(nullable: false),
                    RoleId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KullaniciRolleri", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_KullaniciRolleri_Roller_RoleId",
                        column: x => x.RoleId,
                        principalSchema: "Yetki",
                        principalTable: "Roller",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_KullaniciRolleri_Kullanicilar_UserId",
                        column: x => x.UserId,
                        principalSchema: "Yetki",
                        principalTable: "Kullanicilar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_KisiFotograflari_KisiNo",
                schema: "Kisi",
                table: "KisiFotograflari",
                column: "KisiNo");

            migrationBuilder.CreateIndex(
                name: "IX_Kisiler_CinsiyetNo",
                schema: "Kisi",
                table: "Kisiler",
                column: "CinsiyetNo");

            migrationBuilder.CreateIndex(
                name: "IX_Kisiler_MedeniHalNo",
                schema: "Kisi",
                table: "Kisiler",
                column: "MedeniHalNo");

            migrationBuilder.CreateIndex(
                name: "KisiAdSoyadDogumTarihiCinsiyetIndeks",
                schema: "Kisi",
                table: "Kisiler",
                columns: new[] { "Ad", "Soyad", "DogumTarihi", "CinsiyetNo" },
                unique: true,
                filter: "[Ad] IS NOT NULL AND [Soyad] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_ArkadaslikTeklifleri_TeklifEdilenNo",
                schema: "Yetki",
                table: "ArkadaslikTeklifleri",
                column: "TeklifEdilenNo");

            migrationBuilder.CreateIndex(
                name: "IX_KullaniciGirisleri_UserId",
                schema: "Yetki",
                table: "KullaniciGirisleri",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_KullaniciHaklari_UserId",
                schema: "Yetki",
                table: "KullaniciHaklari",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Kullanicilar_KisiNo",
                schema: "Yetki",
                table: "Kullanicilar",
                column: "KisiNo");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                schema: "Yetki",
                table: "Kullanicilar",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                schema: "Yetki",
                table: "Kullanicilar",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_KullaniciRolleri_RoleId",
                schema: "Yetki",
                table: "KullaniciRolleri",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_RolHaklari_RoleId",
                schema: "Yetki",
                table: "RolHaklari",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                schema: "Yetki",
                table: "Roller",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KisiFotograflari",
                schema: "Kisi");

            migrationBuilder.DropTable(
                name: "ArkadaslikTeklifleri",
                schema: "Yetki");

            migrationBuilder.DropTable(
                name: "KullaniciBiletleri",
                schema: "Yetki");

            migrationBuilder.DropTable(
                name: "KullaniciGirisleri",
                schema: "Yetki");

            migrationBuilder.DropTable(
                name: "KullaniciHaklari",
                schema: "Yetki");

            migrationBuilder.DropTable(
                name: "KullaniciRolleri",
                schema: "Yetki");

            migrationBuilder.DropTable(
                name: "RolHaklari",
                schema: "Yetki");

            migrationBuilder.DropTable(
                name: "Kullanicilar",
                schema: "Yetki");

            migrationBuilder.DropTable(
                name: "Roller",
                schema: "Yetki");

            migrationBuilder.DropTable(
                name: "Kisiler",
                schema: "Kisi");

            migrationBuilder.DropTable(
                name: "Cinsiyetler",
                schema: "Kisi");

            migrationBuilder.DropTable(
                name: "MedeniHaller",
                schema: "Kisi");
        }
    }
}
