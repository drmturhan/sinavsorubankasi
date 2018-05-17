using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace SoruDeposu.DataAccess.migrations.SoruDepo
{
    public partial class KabulEdilebilirlikIndeksi_DecimalOldu : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "KabulEdilebilirlikIndeksi",
                schema: "Soru",
                table: "Sorular",
                nullable: false,
                oldClrType: typeof(int));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "KabulEdilebilirlikIndeksi",
                schema: "Soru",
                table: "Sorular",
                nullable: false,
                oldClrType: typeof(decimal));
        }
    }
}
