using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Migrations.SoruDepo
{
    public partial class SoruDepo_MufredatEklendi : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DonemDersGruplari_Dersler_DersId",
                schema: "Ogrenci",
                table: "DonemDersGruplari");

            migrationBuilder.DropForeignKey(
                name: "FK_DonemDersGruplari_Donemleri_DonemNo",
                schema: "Ogrenci",
                table: "DonemDersGruplari");

            migrationBuilder.DropForeignKey(
                name: "FK_GrupDersleri_DonemDersGruplari_DersGrupNo",
                schema: "Ogrenci",
                table: "GrupDersleri");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DonemDersGruplari",
                schema: "Ogrenci",
                table: "DonemDersGruplari");

            migrationBuilder.RenameTable(
                name: "DonemDersGruplari",
                schema: "Ogrenci",
                newName: "DersGruplari");

            migrationBuilder.RenameIndex(
                name: "IX_DonemDersGruplari_DonemNo",
                schema: "Ogrenci",
                table: "DersGruplari",
                newName: "IX_DersGruplari_DonemNo");

            migrationBuilder.RenameIndex(
                name: "IX_DonemDersGruplari_DersId",
                schema: "Ogrenci",
                table: "DersGruplari",
                newName: "IX_DersGruplari_DersId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DersGruplari",
                schema: "Ogrenci",
                table: "DersGruplari",
                column: "DersGrupId");

            migrationBuilder.CreateTable(
                name: "Mufredatlar",
                schema: "Soru",
                columns: table => new
                {
                    MufredatId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Yil = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mufredatlar", x => x.MufredatId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DersGruplari_MufredatNo",
                schema: "Ogrenci",
                table: "DersGruplari",
                column: "MufredatNo");

            migrationBuilder.AddForeignKey(
                name: "FK_DersGruplari_Dersler_DersId",
                schema: "Ogrenci",
                table: "DersGruplari",
                column: "DersId",
                principalSchema: "Ders",
                principalTable: "Dersler",
                principalColumn: "DersId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DersGruplari_Donemleri_DonemNo",
                schema: "Ogrenci",
                table: "DersGruplari",
                column: "DonemNo",
                principalSchema: "Ogrenci",
                principalTable: "Donemleri",
                principalColumn: "DonemId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DersGruplari_Mufredatlar_MufredatNo",
                schema: "Ogrenci",
                table: "DersGruplari",
                column: "MufredatNo",
                principalSchema: "Soru",
                principalTable: "Mufredatlar",
                principalColumn: "MufredatId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GrupDersleri_DersGruplari_DersGrupNo",
                schema: "Ogrenci",
                table: "GrupDersleri",
                column: "DersGrupNo",
                principalSchema: "Ogrenci",
                principalTable: "DersGruplari",
                principalColumn: "DersGrupId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DersGruplari_Dersler_DersId",
                schema: "Ogrenci",
                table: "DersGruplari");

            migrationBuilder.DropForeignKey(
                name: "FK_DersGruplari_Donemleri_DonemNo",
                schema: "Ogrenci",
                table: "DersGruplari");

            migrationBuilder.DropForeignKey(
                name: "FK_DersGruplari_Mufredatlar_MufredatNo",
                schema: "Ogrenci",
                table: "DersGruplari");

            migrationBuilder.DropForeignKey(
                name: "FK_GrupDersleri_DersGruplari_DersGrupNo",
                schema: "Ogrenci",
                table: "GrupDersleri");

            migrationBuilder.DropTable(
                name: "Mufredatlar",
                schema: "Soru");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DersGruplari",
                schema: "Ogrenci",
                table: "DersGruplari");

            migrationBuilder.DropIndex(
                name: "IX_DersGruplari_MufredatNo",
                schema: "Ogrenci",
                table: "DersGruplari");

            migrationBuilder.RenameTable(
                name: "DersGruplari",
                schema: "Ogrenci",
                newName: "DonemDersGruplari");

            migrationBuilder.RenameIndex(
                name: "IX_DersGruplari_DonemNo",
                schema: "Ogrenci",
                table: "DonemDersGruplari",
                newName: "IX_DonemDersGruplari_DonemNo");

            migrationBuilder.RenameIndex(
                name: "IX_DersGruplari_DersId",
                schema: "Ogrenci",
                table: "DonemDersGruplari",
                newName: "IX_DonemDersGruplari_DersId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DonemDersGruplari",
                schema: "Ogrenci",
                table: "DonemDersGruplari",
                column: "DersGrupId");

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

            migrationBuilder.AddForeignKey(
                name: "FK_GrupDersleri_DonemDersGruplari_DersGrupNo",
                schema: "Ogrenci",
                table: "GrupDersleri",
                column: "DersGrupNo",
                principalSchema: "Ogrenci",
                principalTable: "DonemDersGruplari",
                principalColumn: "DersGrupId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
