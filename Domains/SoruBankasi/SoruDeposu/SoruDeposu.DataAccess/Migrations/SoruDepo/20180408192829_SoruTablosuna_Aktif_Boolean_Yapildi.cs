using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Migrations.SoruDepo
{
    public partial class SoruTablosuna_Aktif_Boolean_Yapildi : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "Onaylandi",
                schema: "Soru",
                table: "Sorular",
                nullable: true,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "Aktif",
                schema: "Soru",
                table: "Sorular",
                nullable: true,
                oldClrType: typeof(int),
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Onaylandi",
                schema: "Soru",
                table: "Sorular",
                nullable: true,
                oldClrType: typeof(bool),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Aktif",
                schema: "Soru",
                table: "Sorular",
                nullable: true,
                oldClrType: typeof(bool),
                oldNullable: true);
        }
    }
}
