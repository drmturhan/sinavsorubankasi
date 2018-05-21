using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace SoruDeposu.DataAccess.migrations.sorudepo
{
    public partial class Kaynakca_CevapAciklama_Eklendi : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SoruAdi",
                schema: "Soru",
                table: "Sorular",
                newName: "Kaynakca");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Kaynakca",
                schema: "Soru",
                table: "Sorular",
                newName: "SoruAdi");
        }
    }
}
