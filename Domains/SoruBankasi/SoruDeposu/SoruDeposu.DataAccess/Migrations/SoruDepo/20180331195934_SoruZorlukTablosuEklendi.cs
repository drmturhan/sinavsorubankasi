using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace SoruDeposu.DataAccess.migrations.SoruDepo
{
    public partial class SoruZorlukTablosuEklendi : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SoruZorlukNo",
                schema: "Soru",
                table: "Sorular",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "SoruZorluklari",
                schema: "Soru",
                columns: table => new
                {
                    ZorlukId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ZorlukAdi = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SoruZorluklari", x => x.ZorlukId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Sorular_SoruZorlukNo",
                schema: "Soru",
                table: "Sorular",
                column: "SoruZorlukNo");

            migrationBuilder.AddForeignKey(
                name: "FK_Sorular_SoruZorluklari_SoruZorlukNo",
                schema: "Soru",
                table: "Sorular",
                column: "SoruZorlukNo",
                principalSchema: "Soru",
                principalTable: "SoruZorluklari",
                principalColumn: "ZorlukId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sorular_SoruZorluklari_SoruZorlukNo",
                schema: "Soru",
                table: "Sorular");

            migrationBuilder.DropTable(
                name: "SoruZorluklari",
                schema: "Soru");

            migrationBuilder.DropIndex(
                name: "IX_Sorular_SoruZorlukNo",
                schema: "Soru",
                table: "Sorular");

            migrationBuilder.DropColumn(
                name: "SoruZorlukNo",
                schema: "Soru",
                table: "Sorular");
        }
    }
}
