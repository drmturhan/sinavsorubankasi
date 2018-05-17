using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Migrations.SoruDepo
{
    public partial class KisiTablosu_MedeniHalBosOlabilir : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Kisiler_MedeniHaller_MedeniHalNo",
                schema: "Kisi",
                table: "Kisiler");

            migrationBuilder.AlterColumn<int>(
                name: "MedeniHalNo",
                schema: "Kisi",
                table: "Kisiler",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_Kisiler_MedeniHaller_MedeniHalNo",
                schema: "Kisi",
                table: "Kisiler",
                column: "MedeniHalNo",
                principalSchema: "Kisi",
                principalTable: "MedeniHaller",
                principalColumn: "MedeniHalId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Kisiler_MedeniHaller_MedeniHalNo",
                schema: "Kisi",
                table: "Kisiler");

            migrationBuilder.AlterColumn<int>(
                name: "MedeniHalNo",
                schema: "Kisi",
                table: "Kisiler",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Kisiler_MedeniHaller_MedeniHalNo",
                schema: "Kisi",
                table: "Kisiler",
                column: "MedeniHalNo",
                principalSchema: "Kisi",
                principalTable: "MedeniHaller",
                principalColumn: "MedeniHalId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
