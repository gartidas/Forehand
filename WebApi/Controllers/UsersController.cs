using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Common.Constants;
using WebApi.Features.SubscriptionCards;
using WebApi.Features.Users;

namespace WebApi.Controllers
{
    [Authorize]
    [Route("api/users")]
    public class UsersController : BaseController
    {
        [Authorize(nameof(RoleEnum.Admin))]
        [HttpGet("trainers-and-employees")]
        public async Task<ActionResult<IEnumerable<GetTrainersAndEmployees.UserDto>>> GetTrainersAndEmployees(string search, CancellationToken cancellationToken)
            => await Mediator.Send(new GetTrainersAndEmployees.Query() { Search = search }, cancellationToken);

        [Authorize(nameof(RoleEnum.Admin))]
        [HttpPatch("{id}/change-registration-status")]
        public async Task<ActionResult> ChangeRegistrationStatus([FromRoute] string id, ChangeRegistrationStatus.Command command, CancellationToken cancellationToken)
        {
            command.UserId = id;
            await Mediator.Send(command, cancellationToken);
            return Ok();
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<GetUser.UserDto>> GetUser([FromRoute] string id, CancellationToken cancellationToken)
           => await Mediator.Send(new GetUser.Query() { UserId = id, CurrentUserId = CurrentUserService.UserId }, cancellationToken);

        [Authorize(nameof(RoleEnum.BasicUser))]
        [HttpPatch("{id}/add-rating")]
        public async Task<ActionResult> AddRating([FromRoute] string id, AddRating.Command command, CancellationToken cancellationToken)
        {
            command.UserId = id;
            command.CurrentUserId = CurrentUserService.UserId;
            await Mediator.Send(command, cancellationToken);
            return Ok();
        }

        [Authorize(nameof(RoleEnum.BasicUser))]
        [HttpGet("{id}/subscription-card")]
        public async Task<ActionResult<GetSubscriptionCardForCustomer.SubscriptionCardDto>> GetSubscriptionCardForCustomer([FromRoute] string id, CancellationToken cancellationToken)
       => await Mediator.Send(new GetSubscriptionCardForCustomer.Query() { CustomerId = id }, cancellationToken);
    }
}
