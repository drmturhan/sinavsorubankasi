using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace SoruDeposu.DataAccess.migrations.sorudepo
{
    public partial class SoruKontrolleri_Eklendi : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "KontrolDegerGruplari",
                schema: "Soru",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    AcikUcluDeger = table.Column<string>(nullable: true),
                    DegerGrupAdi = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KontrolDegerGruplari", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "KontrolListeGruplari",
                schema: "Soru",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    GrupAdi = table.Column<string>(nullable: true),
                    Sira = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KontrolListeGruplari", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "KontrolListeDegerTanimlari",
                schema: "Soru",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Aciklama = table.Column<string>(nullable: true),
                    Deger = table.Column<string>(nullable: true),
                    KontrolDegerGrupTanimNo = table.Column<int>(nullable: false),
                    Puan = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KontrolListeDegerTanimlari", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KontrolListeDegerTanimlari_KontrolDegerGruplari_KontrolDegerGrupTanimNo",
                        column: x => x.KontrolDegerGrupTanimNo,
                        principalSchema: "Soru",
                        principalTable: "KontrolDegerGruplari",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "KontrolListeTanimlari",
                schema: "Soru",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Cumle = table.Column<string>(nullable: true),
                    KontrolDegerGrupTanimNo = table.Column<int>(nullable: false),
                    KontrolListeGrupNo = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KontrolListeTanimlari", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KontrolListeTanimlari_KontrolDegerGruplari_KontrolListeGrupNo",
                        column: x => x.KontrolListeGrupNo,
                        principalSchema: "Soru",
                        principalTable: "KontrolDegerGruplari",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_KontrolListeTanimlari_KontrolListeGruplari_KontrolListeGrupNo",
                        column: x => x.KontrolListeGrupNo,
                        principalSchema: "Soru",
                        principalTable: "KontrolListeGruplari",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SoruKontrolleri",
                schema: "Soru",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    KontrolListeTanimNo = table.Column<int>(nullable: false),
                    KontrolListeTanimiId = table.Column<int>(nullable: true),
                    PersonelNo = table.Column<int>(nullable: false),
                    SinavdaCikabilir = table.Column<bool>(nullable: false),
                    SoruNo = table.Column<int>(nullable: false),
                    Tarih = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SoruKontrolleri", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SoruKontrolleri_KontrolListeTanimlari_KontrolListeTanimiId",
                        column: x => x.KontrolListeTanimiId,
                        principalSchema: "Soru",
                        principalTable: "KontrolListeTanimlari",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SoruKontrolleri_Personeller_PersonelNo",
                        column: x => x.PersonelNo,
                        principalSchema: "Personel",
                        principalTable: "Personeller",
                        principalColumn: "PersonelId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SoruKontrolleri_Sorular_SoruNo",
                        column: x => x.SoruNo,
                        principalSchema: "Soru",
                        principalTable: "Sorular",
                        principalColumn: "SoruId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SoruKontrolDetaylari",
                schema: "Soru",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Degeri = table.Column<string>(nullable: true),
                    Puan = table.Column<int>(nullable: false),
                    SoruKontrolNo = table.Column<int>(nullable: false),
                    Yorum = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SoruKontrolDetaylari", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SoruKontrolDetaylari_SoruKontrolleri_SoruKontrolNo",
                        column: x => x.SoruKontrolNo,
                        principalSchema: "Soru",
                        principalTable: "SoruKontrolleri",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_KontrolListeDegerTanimlari_KontrolDegerGrupTanimNo",
                schema: "Soru",
                table: "KontrolListeDegerTanimlari",
                column: "KontrolDegerGrupTanimNo");

            migrationBuilder.CreateIndex(
                name: "IX_KontrolListeTanimlari_KontrolListeGrupNo",
                schema: "Soru",
                table: "KontrolListeTanimlari",
                column: "KontrolListeGrupNo");

            migrationBuilder.CreateIndex(
                name: "IX_SoruKontrolDetaylari_SoruKontrolNo",
                schema: "Soru",
                table: "SoruKontrolDetaylari",
                column: "SoruKontrolNo");

            migrationBuilder.CreateIndex(
                name: "IX_SoruKontrolleri_KontrolListeTanimiId",
                schema: "Soru",
                table: "SoruKontrolleri",
                column: "KontrolListeTanimiId");

            migrationBuilder.CreateIndex(
                name: "IX_SoruKontrolleri_PersonelNo",
                schema: "Soru",
                table: "SoruKontrolleri",
                column: "PersonelNo");

            migrationBuilder.CreateIndex(
                name: "IX_SoruKontrolleri_SoruNo",
                schema: "Soru",
                table: "SoruKontrolleri",
                column: "SoruNo");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KontrolListeDegerTanimlari",
                schema: "Soru");

            migrationBuilder.DropTable(
                name: "SoruKontrolDetaylari",
                schema: "Soru");

            migrationBuilder.DropTable(
                name: "SoruKontrolleri",
                schema: "Soru");

            migrationBuilder.DropTable(
                name: "KontrolListeTanimlari",
                schema: "Soru");

            migrationBuilder.DropTable(
                name: "KontrolDegerGruplari",
                schema: "Soru");

            migrationBuilder.DropTable(
                name: "KontrolListeGruplari",
                schema: "Soru");
        }
    }
}
