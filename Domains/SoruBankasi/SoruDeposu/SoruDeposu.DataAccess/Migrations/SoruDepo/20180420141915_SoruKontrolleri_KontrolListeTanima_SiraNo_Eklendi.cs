using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace SoruDeposu.DataAccess.migrations.sorudepo
{
    public partial class SoruKontrolleri_KontrolListeTanima_SiraNo_Eklendi : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Sira",
                schema: "Soru",
                table: "KontrolListeTanimlari",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Sira",
                schema: "Soru",
                table: "KontrolListeTanimlari");
        }
    }
}
