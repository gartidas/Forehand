using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace WebApi.Migrations
{
    public partial class BasicSetup : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Price",
                table: "Trainer",
                newName: "ReservationPrice");

            migrationBuilder.AddColumn<string>(
                name: "SubscriptionCardId",
                table: "Customer",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Court",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ReservationPrice = table.Column<double>(type: "float", nullable: false),
                    Label = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Court", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Order",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TrackingNumber = table.Column<long>(type: "bigint", nullable: false),
                    PaymentMethod = table.Column<int>(type: "int", nullable: false),
                    OrderState = table.Column<int>(type: "int", nullable: false),
                    TotalSum = table.Column<double>(type: "float", nullable: false),
                    SubscriptionCardId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CustomerId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    EmployeeId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Order", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Order_Customer_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customer",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Order_Employee_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employee",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SportsGear",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ReservationPrice = table.Column<double>(type: "float", nullable: false),
                    RegistrationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RegistrationNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ShoppingPrice = table.Column<double>(type: "float", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProductionYear = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PhysicalState = table.Column<int>(type: "int", nullable: false),
                    Manufacturer = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SportsGear", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ConsumerGoods",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Price = table.Column<double>(type: "float", nullable: false),
                    ExpirationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ProductionDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Manufacturer = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmployeeId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    OrderId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConsumerGoods", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ConsumerGoods_Employee_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employee",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_ConsumerGoods_Order_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Order",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "GiftCard",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Price = table.Column<double>(type: "float", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Value = table.Column<double>(type: "float", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CustomerId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    OrderId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GiftCard", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GiftCard_Customer_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customer",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_GiftCard_Order_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Order",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Reservation",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Price = table.Column<double>(type: "float", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ReservationState = table.Column<int>(type: "int", nullable: false),
                    CourtId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TrainerId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    CustomerId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    OrderId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reservation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reservation_Court_CourtId",
                        column: x => x.CourtId,
                        principalTable: "Court",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reservation_Customer_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customer",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reservation_Order_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Order",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Reservation_Trainer_TrainerId",
                        column: x => x.TrainerId,
                        principalTable: "Trainer",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SubscriptionCard",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Price = table.Column<double>(type: "float", nullable: false),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SubscriptionType = table.Column<int>(type: "int", nullable: false),
                    CustomerId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    OrderId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubscriptionCard", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SubscriptionCard_Customer_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customer",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SubscriptionCard_Order_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Order",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ReservationSportsGear",
                columns: table => new
                {
                    ReservationId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SportsGearId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReservationSportsGear", x => new { x.ReservationId, x.SportsGearId });
                    table.ForeignKey(
                        name: "FK_ReservationSportsGear_Reservation_ReservationId",
                        column: x => x.ReservationId,
                        principalTable: "Reservation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReservationSportsGear_SportsGear_SportsGearId",
                        column: x => x.SportsGearId,
                        principalTable: "SportsGear",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ConsumerGoods_EmployeeId",
                table: "ConsumerGoods",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_ConsumerGoods_OrderId",
                table: "ConsumerGoods",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_GiftCard_CustomerId",
                table: "GiftCard",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_GiftCard_OrderId",
                table: "GiftCard",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Order_CustomerId",
                table: "Order",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Order_EmployeeId",
                table: "Order",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservation_CourtId",
                table: "Reservation",
                column: "CourtId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservation_CustomerId",
                table: "Reservation",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservation_OrderId",
                table: "Reservation",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Reservation_TrainerId",
                table: "Reservation",
                column: "TrainerId");

            migrationBuilder.CreateIndex(
                name: "IX_ReservationSportsGear_SportsGearId",
                table: "ReservationSportsGear",
                column: "SportsGearId");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionCard_CustomerId",
                table: "SubscriptionCard",
                column: "CustomerId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionCard_OrderId",
                table: "SubscriptionCard",
                column: "OrderId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ConsumerGoods");

            migrationBuilder.DropTable(
                name: "GiftCard");

            migrationBuilder.DropTable(
                name: "ReservationSportsGear");

            migrationBuilder.DropTable(
                name: "SubscriptionCard");

            migrationBuilder.DropTable(
                name: "Reservation");

            migrationBuilder.DropTable(
                name: "SportsGear");

            migrationBuilder.DropTable(
                name: "Court");

            migrationBuilder.DropTable(
                name: "Order");

            migrationBuilder.DropColumn(
                name: "SubscriptionCardId",
                table: "Customer");

            migrationBuilder.RenameColumn(
                name: "ReservationPrice",
                table: "Trainer",
                newName: "Price");
        }
    }
}
