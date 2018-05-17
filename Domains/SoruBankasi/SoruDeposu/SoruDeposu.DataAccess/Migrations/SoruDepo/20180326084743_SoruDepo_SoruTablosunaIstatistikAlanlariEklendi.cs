using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace SoruDeposu.DataAccess.migrations.SoruDepo
{
    public partial class SoruDepo_SoruTablosunaIstatistikAlanlariEklendi : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
           

            migrationBuilder.AddColumn<int>(
                name: "BirimNo",
                schema: "Soru",
                table: "Sorular",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DersGrubuNo",
                schema: "Soru",
                table: "Sorular",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DonemNo",
                schema: "Soru",
                table: "Sorular",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PersonelNo",
                schema: "Soru",
                table: "Sorular",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProgramNo",
                schema: "Soru",
                table: "Sorular",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BirimNo",
                schema: "Soru",
                table: "Sorular");

            migrationBuilder.DropColumn(
                name: "DersGrubuNo",
                schema: "Soru",
                table: "Sorular");

            migrationBuilder.DropColumn(
                name: "DonemNo",
                schema: "Soru",
                table: "Sorular");

            migrationBuilder.DropColumn(
                name: "PersonelNo",
                schema: "Soru",
                table: "Sorular");

            migrationBuilder.DropColumn(
                name: "ProgramNo",
                schema: "Soru",
                table: "Sorular");

           
        }
    }
}
