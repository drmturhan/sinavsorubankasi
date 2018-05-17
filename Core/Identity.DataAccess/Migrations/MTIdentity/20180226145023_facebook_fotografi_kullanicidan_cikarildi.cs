using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace Identity.DataAccess.Migrations.MTIdentity
{
    public partial class facebook_fotografi_kullanicidan_cikarildi : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FaceBookPictureUrl",
                schema: "Yetki",
                table: "Kullanicilar");

            migrationBuilder.DropColumn(
                name: "Id",
                schema: "Kisi",
                table: "KisiFotograflari");

            migrationBuilder.AddColumn<string>(
                name: "DisKaynakId",
                schema: "Kisi",
                table: "KisiFotograflari",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DisKaynakId",
                schema: "Kisi",
                table: "KisiFotograflari");

            migrationBuilder.AddColumn<string>(
                name: "FaceBookPictureUrl",
                schema: "Yetki",
                table: "Kullanicilar",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Id",
                schema: "Kisi",
                table: "KisiFotograflari",
                nullable: false,
                defaultValue: 0);
        }
    }
}
