using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Common.Constants;
using WebApi.Features.Orders;
using static WebApi.Features.Orders.GetOrders;

namespace WebApi.Controllers
{
    [Authorize]
    [Route("api/orders")]
    public class OrdersController : BaseController
    {
        [HttpPost]
        public async Task<ActionResult<string>> AddOrder(AddOrder.Command command, CancellationToken cancellationToken)
        {
            if (CurrentUserService.Role == RoleEnum.BasicUser)
                command.CustomerId = CurrentUserService.UserId;

            if (CurrentUserService.Role == RoleEnum.Employee)
                command.EmployeeId = CurrentUserService.UserId;

            return Ok(await Mediator.Send(command, cancellationToken));
        }

        [Authorize(nameof(RoleEnum.Employee))]
        [HttpGet()]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders(CancellationToken cancellationToken)
      => await Mediator.Send(new GetOrders.Query(), cancellationToken);

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrder([FromRoute] string id, CancellationToken cancellationToken)
          => await Mediator.Send(new GetOrder.Query() { OrderId = id }, cancellationToken);
    }
}
