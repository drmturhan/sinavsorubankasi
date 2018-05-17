using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Migrations.SoruDepo
{
    public partial class SoruDepo_Ciddi_DegisiklikVar : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Dersler_AlanKodlari_AlanKodNo",
                schema: "Ders",
                table: "Dersler");

            migrationBuilder.DropForeignKey(
                name: "FK_Dersler_DonemDersGruplari_DonemDersGrupNo",
                schema: "Ders",
                table: "Dersler");

            migrationBuilder.DropForeignKey(
                name: "FK_DonemDersGruplari_ProgramDonemleri_ProgramDonemNo",
                schema: "Ogrenci",
                table: "DonemDersGruplari");

            migrationBuilder.DropTable(
                name: "DonemDersleri",
                schema: "Ogrenci");

            migrationBuilder.DropTable(
                name: "ProgramAkademikTakvimleri",
                schema: "Ogrenci");

            migrationBuilder.DropTable(
                name: "AkademikTakvimler",
                schema: "Ogrenci");

            migrationBuilder.DropTable(
                name: "ProgramDonemleri",
                schema: "Ogrenci");

            migrationBuilder.DropIndex(
                name: "IX_Dersler_DonemDersGrupNo",
                schema: "Ders",
                table: "Dersler");

            migrationBuilder.DropIndex(
                name: "IX_DonemDersGruplari_ProgramDonemNo",
                schema: "Ogrenci",
                table: "DonemDersGruplari");

            migrationBuilder.DropColumn(
                name: "DonemDersGrupNo",
                schema: "Ders",
                table: "Dersler");

            migrationBuilder.RenameColumn(
                name: "ProgramDonemNo",
                schema: "Ogrenci",
                table: "DonemDersGruplari",
                newName: "MufredatNo");

            migrationBuilder.RenameColumn(
                name: "DonemDersGrupId",
                schema: "Ogrenci",
                table: "DonemDersGruplari",
                newName: "DersGrupId");

            migrationBuilder.AlterColumn<int>(
                name: "AlanKodNo",
                schema: "Ders",
                table: "Dersler",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddColumn<int>(
                name: "DersId",
                schema: "Ogrenci",
                table: "DonemDersGruplari",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DersNo",
                schema: "Ogrenci",
                table: "DonemDersGruplari",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DonemNo",
                schema: "Ogrenci",
                table: "DonemDersGruplari",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Donemleri",
                schema: "Ogrenci",
                columns: table => new
                {
                    DonemId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Aktif = table.Column<int>(nullable: false),
                    DonemAdi = table.Column<string>(nullable: true),
                    DonemNumarasi = table.Column<int>(nullable: false),
                    ProgramNo = table.Column<int>(nullable: false),
                    Sinifi = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Donemleri", x => x.DonemId);
                    table.ForeignKey(
                        name: "FK_Donemleri_Programlar_ProgramNo",
                        column: x => x.ProgramNo,
                        principalSchema: "Ogrenci",
                        principalTable: "Programlar",
                        principalColumn: "ProgramId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GrupDersleri",
                schema: "Ogrenci",
                columns: table => new
                {
                    DersGrupNo = table.Column<int>(nullable: false),
                    DersNo = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GrupDersleri", x => new { x.DersGrupNo, x.DersNo });
                    table.ForeignKey(
                        name: "FK_GrupDersleri_DonemDersGruplari_DersGrupNo",
                        column: x => x.DersGrupNo,
                        principalSchema: "Ogrenci",
                        principalTable: "DonemDersGruplari",
                        principalColumn: "DersGrupId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GrupDersleri_Dersler_DersNo",
                        column: x => x.DersNo,
                        principalSchema: "Ders",
                        principalTable: "Dersler",
                        principalColumn: "DersId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DonemDersGruplari_DersId",
                schema: "Ogrenci",
                table: "DonemDersGruplari",
                column: "DersId");

            migrationBuilder.CreateIndex(
                name: "IX_DonemDersGruplari_DonemNo",
                schema: "Ogrenci",
                table: "DonemDersGruplari",
                column: "DonemNo");

            migrationBuilder.CreateIndex(
                name: "IX_Donemleri_ProgramNo",
                schema: "Ogrenci",
                table: "Donemleri",
                column: "ProgramNo");

            migrationBuilder.CreateIndex(
                name: "IX_GrupDersleri_DersNo",
                schema: "Ogrenci",
                table: "GrupDersleri",
                column: "DersNo");

            migrationBuilder.AddForeignKey(
                name: "FK_Dersler_AlanKodlari_AlanKodNo",
                schema: "Ders",
                table: "Dersler",
                column: "AlanKodNo",
                principalSchema: "Ders",
                principalTable: "AlanKodlari",
                principalColumn: "AlanKodId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DonemDersGruplari_Dersler_DersId",
                schema: "Ogrenci",
                table: "DonemDersGruplari",
                column: "DersId",
                principalSchema: "Ders",
                principalTable: "Dersler",
                principalColumn: "DersId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DonemDersGruplari_Donemleri_DonemNo",
                schema: "Ogrenci",
                table: "DonemDersGruplari",
                column: "DonemNo",
                principalSchema: "Ogrenci",
                principalTable: "Donemleri",
                principalColumn: "DonemId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Dersler_AlanKodlari_AlanKodNo",
                schema: "Ders",
                table: "Dersler");

            migrationBuilder.DropForeignKey(
                name: "FK_DonemDersGruplari_Dersler_DersId",
                schema: "Ogrenci",
                table: "DonemDersGruplari");

            migrationBuilder.DropForeignKey(
                name: "FK_DonemDersGruplari_Donemleri_DonemNo",
                schema: "Ogrenci",
                table: "DonemDersGruplari");

            migrationBuilder.DropTable(
                name: "Donemleri",
                schema: "Ogrenci");

            migrationBuilder.DropTable(
                name: "GrupDersleri",
                schema: "Ogrenci");

            migrationBuilder.DropIndex(
                name: "IX_DonemDersGruplari_DersId",
                schema: "Ogrenci",
                table: "DonemDersGruplari");

            migrationBuilder.DropIndex(
                name: "IX_DonemDersGruplari_DonemNo",
                schema: "Ogrenci",
                table: "DonemDersGruplari");

            migrationBuilder.DropColumn(
                name: "DersId",
                schema: "Ogrenci",
                table: "DonemDersGruplari");

            migrationBuilder.DropColumn(
                name: "DersNo",
                schema: "Ogrenci",
                table: "DonemDersGruplari");

            migrationBuilder.DropColumn(
                name: "DonemNo",
                schema: "Ogrenci",
                table: "DonemDersGruplari");

            migrationBuilder.RenameColumn(
                name: "MufredatNo",
                schema: "Ogrenci",
                table: "DonemDersGruplari",
                newName: "ProgramDonemNo");

            migrationBuilder.RenameColumn(
                name: "DersGrupId",
                schema: "Ogrenci",
                table: "DonemDersGruplari",
                newName: "DonemDersGrupId");

            migrationBuilder.AlterColumn<int>(
                name: "AlanKodNo",
                schema: "Ders",
                table: "Dersler",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DonemDersGrupNo",
                schema: "Ders",
                table: "Dersler",
                nullable: false,
                defaultValue: 0);

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
                name: "ProgramDonemleri",
                schema: "Ogrenci",
                columns: table => new
                {
                    ProgramDonemId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Aktif = table.Column<int>(nullable: false),
                    DonemAdi = table.Column<string>(nullable: true),
                    DonemNumarasi = table.Column<int>(nullable: false),
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
                name: "ProgramAkademikTakvimleri",
                schema: "Ogrenci",
                columns: table => new
                {
                    ProgramAkademikTakvimId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Aciklama = table.Column<string>(nullable: true),
                    AkademikTakvimNo = table.Column<int>(nullable: true),
                    Baslangic = table.Column<DateTime>(nullable: false),
                    Bitis = table.Column<DateTime>(nullable: true),
                    DonemNo = table.Column<int>(nullable: true),
                    ProgramNo = table.Column<int>(nullable: true)
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
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProgramAkademikTakvimleri_ProgramDonemleri_DonemNo",
                        column: x => x.DonemNo,
                        principalSchema: "Ogrenci",
                        principalTable: "ProgramDonemleri",
                        principalColumn: "ProgramDonemId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProgramAkademikTakvimleri_Programlar_ProgramNo",
                        column: x => x.ProgramNo,
                        principalSchema: "Ogrenci",
                        principalTable: "Programlar",
                        principalColumn: "ProgramId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Dersler_DonemDersGrupNo",
                schema: "Ders",
                table: "Dersler",
                column: "DonemDersGrupNo");

            migrationBuilder.CreateIndex(
                name: "IX_DonemDersGruplari_ProgramDonemNo",
                schema: "Ogrenci",
                table: "DonemDersGruplari",
                column: "ProgramDonemNo");

            migrationBuilder.CreateIndex(
                name: "IX_AkademikTakvimler_UniversiteNo",
                schema: "Ogrenci",
                table: "AkademikTakvimler",
                column: "UniversiteNo");

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
                name: "IX_ProgramAkademikTakvimleri_DonemNo",
                schema: "Ogrenci",
                table: "ProgramAkademikTakvimleri",
                column: "DonemNo");

            migrationBuilder.CreateIndex(
                name: "IX_ProgramAkademikTakvimleri_ProgramNo",
                schema: "Ogrenci",
                table: "ProgramAkademikTakvimleri",
                column: "ProgramNo");

            migrationBuilder.CreateIndex(
                name: "IX_ProgramDonemleri_ProgramNo",
                schema: "Ogrenci",
                table: "ProgramDonemleri",
                column: "ProgramNo");

            migrationBuilder.AddForeignKey(
                name: "FK_Dersler_AlanKodlari_AlanKodNo",
                schema: "Ders",
                table: "Dersler",
                column: "AlanKodNo",
                principalSchema: "Ders",
                principalTable: "AlanKodlari",
                principalColumn: "AlanKodId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Dersler_DonemDersGruplari_DonemDersGrupNo",
                schema: "Ders",
                table: "Dersler",
                column: "DonemDersGrupNo",
                principalSchema: "Ogrenci",
                principalTable: "DonemDersGruplari",
                principalColumn: "DonemDersGrupId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DonemDersGruplari_ProgramDonemleri_ProgramDonemNo",
                schema: "Ogrenci",
                table: "DonemDersGruplari",
                column: "ProgramDonemNo",
                principalSchema: "Ogrenci",
                principalTable: "ProgramDonemleri",
                principalColumn: "ProgramDonemId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
