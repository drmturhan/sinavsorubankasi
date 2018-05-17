using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Migrations.SoruDepo
{
    public partial class SoruDepo_Adlar_IntKalmis_Duzeltildi : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "PozisyonKodu",
                schema: "Universite",
                table: "Pozisyonlar",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<string>(
                name: "PozisyonAdi",
                schema: "Universite",
                table: "Pozisyonlar",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<string>(
                name: "Kisaltmasi",
                schema: "Universite",
                table: "Pozisyonlar",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<string>(
                name: "BirimAdi",
                schema: "Universite",
                table: "Birimler",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<string>(
                name: "BirimGrupAdi",
                schema: "Universite",
                table: "BirimGruplari",
                nullable: true,
                oldClrType: typeof(int));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "PozisyonKodu",
                schema: "Universite",
                table: "Pozisyonlar",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "PozisyonAdi",
                schema: "Universite",
                table: "Pozisyonlar",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Kisaltmasi",
                schema: "Universite",
                table: "Pozisyonlar",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "BirimAdi",
                schema: "Universite",
                table: "Birimler",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "BirimGrupAdi",
                schema: "Universite",
                table: "BirimGruplari",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);
        }
    }
}
