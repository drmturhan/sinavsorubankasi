using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Migrations.SoruDepo
{
    public partial class SoruDepo_ProgramAkademikTablosu_Duzeltildi : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProgramAkademikTakvimleri_AkademikTakvimler_AkademikTakvimNo",
                schema: "Ogrenci",
                table: "ProgramAkademikTakvimleri");

            migrationBuilder.DropForeignKey(
                name: "FK_ProgramAkademikTakvimleri_ProgramDonemleri_DonemiProgramDonemId",
                schema: "Ogrenci",
                table: "ProgramAkademikTakvimleri");

            migrationBuilder.DropIndex(
                name: "IX_ProgramAkademikTakvimleri_DonemiProgramDonemId",
                schema: "Ogrenci",
                table: "ProgramAkademikTakvimleri");

            migrationBuilder.DropColumn(
                name: "DonemiProgramDonemId",
                schema: "Ogrenci",
                table: "ProgramAkademikTakvimleri");

            migrationBuilder.AlterColumn<int>(
                name: "ProgramNo",
                schema: "Ogrenci",
                table: "ProgramAkademikTakvimleri",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<int>(
                name: "DonemNo",
                schema: "Ogrenci",
                table: "ProgramAkademikTakvimleri",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<int>(
                name: "AkademikTakvimNo",
                schema: "Ogrenci",
                table: "ProgramAkademikTakvimleri",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.CreateIndex(
                name: "IX_ProgramAkademikTakvimleri_DonemNo",
                schema: "Ogrenci",
                table: "ProgramAkademikTakvimleri",
                column: "DonemNo");

            migrationBuilder.CreateIndex(
                name: "IX_ProgramAkademikTakvimleri_ProgramNo",
                schema: "Ogrenci",
                table: "ProgramAkademikTakvimleri",
                column: "ProgramNo");

            migrationBuilder.AddForeignKey(
                name: "FK_ProgramAkademikTakvimleri_AkademikTakvimler_AkademikTakvimNo",
                schema: "Ogrenci",
                table: "ProgramAkademikTakvimleri",
                column: "AkademikTakvimNo",
                principalSchema: "Ogrenci",
                principalTable: "AkademikTakvimler",
                principalColumn: "AkademikTakvimId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ProgramAkademikTakvimleri_ProgramDonemleri_DonemNo",
                schema: "Ogrenci",
                table: "ProgramAkademikTakvimleri",
                column: "DonemNo",
                principalSchema: "Ogrenci",
                principalTable: "ProgramDonemleri",
                principalColumn: "ProgramDonemId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ProgramAkademikTakvimleri_Programlar_ProgramNo",
                schema: "Ogrenci",
                table: "ProgramAkademikTakvimleri",
                column: "ProgramNo",
                principalSchema: "Ogrenci",
                principalTable: "Programlar",
                principalColumn: "ProgramId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProgramAkademikTakvimleri_AkademikTakvimler_AkademikTakvimNo",
                schema: "Ogrenci",
                table: "ProgramAkademikTakvimleri");

            migrationBuilder.DropForeignKey(
                name: "FK_ProgramAkademikTakvimleri_ProgramDonemleri_DonemNo",
                schema: "Ogrenci",
                table: "ProgramAkademikTakvimleri");

            migrationBuilder.DropForeignKey(
                name: "FK_ProgramAkademikTakvimleri_Programlar_ProgramNo",
                schema: "Ogrenci",
                table: "ProgramAkademikTakvimleri");

            migrationBuilder.DropIndex(
                name: "IX_ProgramAkademikTakvimleri_DonemNo",
                schema: "Ogrenci",
                table: "ProgramAkademikTakvimleri");

            migrationBuilder.DropIndex(
                name: "IX_ProgramAkademikTakvimleri_ProgramNo",
                schema: "Ogrenci",
                table: "ProgramAkademikTakvimleri");

            migrationBuilder.AlterColumn<int>(
                name: "ProgramNo",
                schema: "Ogrenci",
                table: "ProgramAkademikTakvimleri",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "DonemNo",
                schema: "Ogrenci",
                table: "ProgramAkademikTakvimleri",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "AkademikTakvimNo",
                schema: "Ogrenci",
                table: "ProgramAkademikTakvimleri",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DonemiProgramDonemId",
                schema: "Ogrenci",
                table: "ProgramAkademikTakvimleri",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProgramAkademikTakvimleri_DonemiProgramDonemId",
                schema: "Ogrenci",
                table: "ProgramAkademikTakvimleri",
                column: "DonemiProgramDonemId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProgramAkademikTakvimleri_AkademikTakvimler_AkademikTakvimNo",
                schema: "Ogrenci",
                table: "ProgramAkademikTakvimleri",
                column: "AkademikTakvimNo",
                principalSchema: "Ogrenci",
                principalTable: "AkademikTakvimler",
                principalColumn: "AkademikTakvimId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProgramAkademikTakvimleri_ProgramDonemleri_DonemiProgramDonemId",
                schema: "Ogrenci",
                table: "ProgramAkademikTakvimleri",
                column: "DonemiProgramDonemId",
                principalSchema: "Ogrenci",
                principalTable: "ProgramDonemleri",
                principalColumn: "ProgramDonemId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
