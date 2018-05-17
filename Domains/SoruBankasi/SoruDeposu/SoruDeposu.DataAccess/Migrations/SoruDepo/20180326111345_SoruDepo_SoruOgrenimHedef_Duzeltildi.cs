using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace SoruDeposu.DataAccess.migrations.SoruDepo
{
    public partial class SoruDepo_SoruOgrenimHedef_Duzeltildi : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SoruOgrenimHedefleri_Sorular_OgrenimHedefNo",
                schema: "Soru",
                table: "SoruOgrenimHedefleri");

            migrationBuilder.DropForeignKey(
                name: "FK_SoruOgrenimHedefleri_DersKonuOgrenimHedefleri_SoruNo",
                schema: "Soru",
                table: "SoruOgrenimHedefleri");

            migrationBuilder.AddForeignKey(
                name: "FK_SoruOgrenimHedefleri_DersKonuOgrenimHedefleri_OgrenimHedefNo",
                schema: "Soru",
                table: "SoruOgrenimHedefleri",
                column: "OgrenimHedefNo",
                principalSchema: "Ders",
                principalTable: "DersKonuOgrenimHedefleri",
                principalColumn: "OgrenimHedefId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SoruOgrenimHedefleri_Sorular_SoruNo",
                schema: "Soru",
                table: "SoruOgrenimHedefleri",
                column: "SoruNo",
                principalSchema: "Soru",
                principalTable: "Sorular",
                principalColumn: "SoruId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SoruOgrenimHedefleri_DersKonuOgrenimHedefleri_OgrenimHedefNo",
                schema: "Soru",
                table: "SoruOgrenimHedefleri");

            migrationBuilder.DropForeignKey(
                name: "FK_SoruOgrenimHedefleri_Sorular_SoruNo",
                schema: "Soru",
                table: "SoruOgrenimHedefleri");

            migrationBuilder.AddForeignKey(
                name: "FK_SoruOgrenimHedefleri_Sorular_OgrenimHedefNo",
                schema: "Soru",
                table: "SoruOgrenimHedefleri",
                column: "OgrenimHedefNo",
                principalSchema: "Soru",
                principalTable: "Sorular",
                principalColumn: "SoruId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SoruOgrenimHedefleri_DersKonuOgrenimHedefleri_SoruNo",
                schema: "Soru",
                table: "SoruOgrenimHedefleri",
                column: "SoruNo",
                principalSchema: "Ders",
                principalTable: "DersKonuOgrenimHedefleri",
                principalColumn: "OgrenimHedefId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
