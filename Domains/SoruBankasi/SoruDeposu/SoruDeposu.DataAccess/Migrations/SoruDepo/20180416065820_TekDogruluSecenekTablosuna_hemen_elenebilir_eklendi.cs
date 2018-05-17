using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace SoruDeposu.DataAccess.migrations.sorudepo
{
    public partial class TekDogruluSecenekTablosuna_hemen_elenebilir_eklendi : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "hemenElenebilir",
                schema: "Soru",
                table: "TekDoguruluSoruSecenekleri",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "hemenElenebilir",
                schema: "Soru",
                table: "TekDoguruluSoruSecenekleri");
        }
    }
}
