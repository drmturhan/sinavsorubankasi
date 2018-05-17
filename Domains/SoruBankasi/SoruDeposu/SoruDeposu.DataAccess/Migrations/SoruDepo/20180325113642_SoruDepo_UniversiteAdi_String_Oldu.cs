using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Migrations.SoruDepo
{
    public partial class SoruDepo_UniversiteAdi_String_Oldu : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "UniversiteAdi",
                schema: "Universite",
                table: "Universiteler",
                nullable: true,
                oldClrType: typeof(int));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "UniversiteAdi",
                schema: "Universite",
                table: "Universiteler",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);
        }
    }
}
