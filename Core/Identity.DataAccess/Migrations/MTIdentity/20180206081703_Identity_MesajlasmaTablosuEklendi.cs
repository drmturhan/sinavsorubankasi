using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace Identity.DataAccess.Migrations.MTIdentity
{
    public partial class Identity_MesajlasmaTablosuEklendi : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Mesajlasmalar",
                schema: "Yetki",
                columns: table => new
                {
                    MesajId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    AlanNo = table.Column<int>(nullable: false),
                    AlanSildi = table.Column<bool>(nullable: false),
                    GonderenNo = table.Column<int>(nullable: false),
                    GonderenSildi = table.Column<bool>(nullable: false),
                    GonderilmeZamani = table.Column<DateTime>(nullable: true),
                    Icerik = table.Column<string>(nullable: true),
                    Okundu = table.Column<bool>(nullable: false),
                    OkunmaZamani = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mesajlasmalar", x => x.MesajId);
                    table.ForeignKey(
                        name: "FK_Mesajlasmalar_Kullanicilar_AlanNo",
                        column: x => x.AlanNo,
                        principalSchema: "Yetki",
                        principalTable: "Kullanicilar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Mesajlasmalar_Kullanicilar_GonderenNo",
                        column: x => x.GonderenNo,
                        principalSchema: "Yetki",
                        principalTable: "Kullanicilar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Mesajlasmalar_AlanNo",
                schema: "Yetki",
                table: "Mesajlasmalar",
                column: "AlanNo");

            migrationBuilder.CreateIndex(
                name: "IX_Mesajlasmalar_GonderenNo",
                schema: "Yetki",
                table: "Mesajlasmalar",
                column: "GonderenNo");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Mesajlasmalar",
                schema: "Yetki");
        }
    }
}
