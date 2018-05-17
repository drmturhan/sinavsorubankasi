using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace Identity.DataAccess.Migrations.MTIdentity
{
    public partial class ArkadaslikTablosuna_IptalBilgileriKoyuldu : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Id",
                schema: "Yetki",
                table: "ArkadaslikTeklifleri");

            migrationBuilder.DropColumn(
                name: "Kimlik",
                schema: "Yetki",
                table: "ArkadaslikTeklifleri");

            migrationBuilder.AddColumn<int>(
                name: "IptalEdenKullaniciNo",
                schema: "Yetki",
                table: "ArkadaslikTeklifleri",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IptalEdildi",
                schema: "Yetki",
                table: "ArkadaslikTeklifleri",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "IptalTarihi",
                schema: "Yetki",
                table: "ArkadaslikTeklifleri",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IptalEdenKullaniciNo",
                schema: "Yetki",
                table: "ArkadaslikTeklifleri");

            migrationBuilder.DropColumn(
                name: "IptalEdildi",
                schema: "Yetki",
                table: "ArkadaslikTeklifleri");

            migrationBuilder.DropColumn(
                name: "IptalTarihi",
                schema: "Yetki",
                table: "ArkadaslikTeklifleri");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                schema: "Yetki",
                table: "ArkadaslikTeklifleri",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Kimlik",
                schema: "Yetki",
                table: "ArkadaslikTeklifleri",
                nullable: false,
                defaultValue: 0);
        }
    }
}
