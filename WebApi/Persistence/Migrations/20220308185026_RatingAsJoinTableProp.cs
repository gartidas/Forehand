using Microsoft.EntityFrameworkCore.Migrations;

namespace WebApi.Migrations
{
    public partial class RatingAsJoinTableProp : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Ratings",
                table: "Trainer");

            migrationBuilder.AddColumn<int>(
                name: "Rating",
                table: "CustomerRating",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Rating",
                table: "CustomerRating");

            migrationBuilder.AddColumn<string>(
                name: "Ratings",
                table: "Trainer",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
