using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Migrations.SoruDepo
{
    public partial class SoruDepo_ProgramDonemNo_Numara_Yapildi : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DonemNo",
                schema: "Ogrenci",
                table: "ProgramDonemleri",
                newName: "DonemNumarasi");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DonemNumarasi",
                schema: "Ogrenci",
                table: "ProgramDonemleri",
                newName: "DonemNo");
        }
    }
}
