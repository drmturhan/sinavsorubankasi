using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace Identity.DataAccess.migrations.MTIdentity
{
    public partial class Kullaniciya_PersonelBilgisi_Eklendi : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Personel");

            //migrationBuilder.CreateTable(
            //    name: "Personeller",
            //    schema: "Personel",
            //    columns: table => new
            //    {
            //        PersonelId = table.Column<int>(nullable: false)
            //            .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
            //        DisKurumPersonelNo = table.Column<string>(nullable: true),
            //        KisiNo = table.Column<int>(nullable: false)
            //    },
            //    constraints: table =>
            //    {
            //        table.PrimaryKey("PK_Personeller", x => x.PersonelId);
            //        table.ForeignKey(
            //            name: "FK_Personeller_Kisiler_KisiNo",
            //            column: x => x.KisiNo,
            //            principalSchema: "Kisi",
            //            principalTable: "Kisiler",
            //            principalColumn: "KisiId",
            //            onDelete: ReferentialAction.Cascade);
            //    });

            //migrationBuilder.CreateIndex(
            //    name: "IX_Personeller_KisiNo",
            //    schema: "Personel",
            //    table: "Personeller",
            //    column: "KisiNo");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Personeller",
                schema: "Personel");
        }
    }
}
