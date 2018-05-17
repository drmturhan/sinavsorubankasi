using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Migrations.SoruDepo
{
    public partial class SoruDepo_DersGrubundanDersCikarildi : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DersGruplari_Dersler_DersId",
                schema: "Ogrenci",
                table: "DersGruplari");

            migrationBuilder.DropIndex(
                name: "IX_DersGruplari_DersId",
                schema: "Ogrenci",
                table: "DersGruplari");

            migrationBuilder.DropColumn(
                name: "DersId",
                schema: "Ogrenci",
                table: "DersGruplari");

            migrationBuilder.DropColumn(
                name: "DersNo",
                schema: "Ogrenci",
                table: "DersGruplari");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DersId",
                schema: "Ogrenci",
                table: "DersGruplari",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DersNo",
                schema: "Ogrenci",
                table: "DersGruplari",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_DersGruplari_DersId",
                schema: "Ogrenci",
                table: "DersGruplari",
                column: "DersId");

            migrationBuilder.AddForeignKey(
                name: "FK_DersGruplari_Dersler_DersId",
                schema: "Ogrenci",
                table: "DersGruplari",
                column: "DersId",
                principalSchema: "Ders",
                principalTable: "Dersler",
                principalColumn: "DersId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
