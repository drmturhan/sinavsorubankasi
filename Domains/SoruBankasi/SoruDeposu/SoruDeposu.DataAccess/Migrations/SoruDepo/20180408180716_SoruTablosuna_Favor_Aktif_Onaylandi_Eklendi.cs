using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Migrations.SoruDepo
{
    public partial class SoruTablosuna_Favor_Aktif_Onaylandi_Eklendi : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Aktif",
                schema: "Soru",
                table: "Sorular",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Favori",
                schema: "Soru",
                table: "Sorular",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Onaylandi",
                schema: "Soru",
                table: "Sorular",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Aktif",
                schema: "Soru",
                table: "Sorular");

            migrationBuilder.DropColumn(
                name: "Favori",
                schema: "Soru",
                table: "Sorular");

            migrationBuilder.DropColumn(
                name: "Onaylandi",
                schema: "Soru",
                table: "Sorular");
        }
    }
}
