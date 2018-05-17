using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace Identity.DataAccess.Migrations.MTIdentity
{
    public partial class FacebookGirisiHazirliklariYapildi : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Kisiler_Cinsiyetler_CinsiyetNo",
                schema: "Kisi",
                table: "Kisiler");

            migrationBuilder.DropIndex(
                name: "KisiAdSoyadDogumTarihiCinsiyetIndeks",
                schema: "Kisi",
                table: "Kisiler");

            migrationBuilder.AddColumn<string>(
                name: "FaceBookPictureUrl",
                schema: "Yetki",
                table: "Kullanicilar",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "FacebookId",
                schema: "Yetki",
                table: "Kullanicilar",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CinsiyetNo",
                schema: "Kisi",
                table: "Kisiler",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.CreateIndex(
                name: "KisiAdSoyadDogumTarihiCinsiyetIndeks",
                schema: "Kisi",
                table: "Kisiler",
                columns: new[] { "Ad", "Soyad", "DogumTarihi", "CinsiyetNo" },
                unique: true,
                filter: "[Ad] IS NOT NULL AND [Soyad] IS NOT NULL AND [CinsiyetNo] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Kisiler_Cinsiyetler_CinsiyetNo",
                schema: "Kisi",
                table: "Kisiler",
                column: "CinsiyetNo",
                principalSchema: "Kisi",
                principalTable: "Cinsiyetler",
                principalColumn: "CinsiyetId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Kisiler_Cinsiyetler_CinsiyetNo",
                schema: "Kisi",
                table: "Kisiler");

            migrationBuilder.DropIndex(
                name: "KisiAdSoyadDogumTarihiCinsiyetIndeks",
                schema: "Kisi",
                table: "Kisiler");

            migrationBuilder.DropColumn(
                name: "FaceBookPictureUrl",
                schema: "Yetki",
                table: "Kullanicilar");

            migrationBuilder.DropColumn(
                name: "FacebookId",
                schema: "Yetki",
                table: "Kullanicilar");

            migrationBuilder.AlterColumn<int>(
                name: "CinsiyetNo",
                schema: "Kisi",
                table: "Kisiler",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "KisiAdSoyadDogumTarihiCinsiyetIndeks",
                schema: "Kisi",
                table: "Kisiler",
                columns: new[] { "Ad", "Soyad", "DogumTarihi", "CinsiyetNo" },
                unique: true,
                filter: "[Ad] IS NOT NULL AND [Soyad] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Kisiler_Cinsiyetler_CinsiyetNo",
                schema: "Kisi",
                table: "Kisiler",
                column: "CinsiyetNo",
                principalSchema: "Kisi",
                principalTable: "Cinsiyetler",
                principalColumn: "CinsiyetId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
