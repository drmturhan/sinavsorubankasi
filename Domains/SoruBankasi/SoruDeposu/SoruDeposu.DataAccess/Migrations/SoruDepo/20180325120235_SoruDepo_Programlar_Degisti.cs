using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Migrations.SoruDepo
{
    public partial class SoruDepo_Programlar_Degisti : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BirimAdi",
                schema: "Ogrenci",
                table: "Programlar",
                newName: "ProgramAdi");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ProgramAdi",
                schema: "Ogrenci",
                table: "Programlar",
                newName: "BirimAdi");
        }
    }
}
