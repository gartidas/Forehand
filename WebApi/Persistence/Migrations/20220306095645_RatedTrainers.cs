using Microsoft.EntityFrameworkCore.Migrations;

namespace WebApi.Migrations
{
    public partial class RatedTrainers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CustomerRatings",
                columns: table => new
                {
                    RatedById = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RatedTrainerId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerRatings", x => new { x.RatedById, x.RatedTrainerId });
                    table.ForeignKey(
                        name: "FK_CustomerRatings_Customer_RatedById",
                        column: x => x.RatedById,
                        principalTable: "Customer",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CustomerRatings_Trainer_RatedTrainerId",
                        column: x => x.RatedTrainerId,
                        principalTable: "Trainer",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_CustomerRatings_RatedTrainerId",
                table: "CustomerRatings",
                column: "RatedTrainerId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CustomerRatings");
        }
    }
}
