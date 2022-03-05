using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Common.Constants;
using WebApi.Features.Users;
using WebApi.Persistence;

namespace WebApi.Controllers
{
    [Authorize]
    [Route("api/users")]
    public class UsersController : BaseController
    {
        private readonly ForehandContext _db;

        public UsersController(ForehandContext db)
        {
            _db = db;
        }

        [Authorize(nameof(RoleEnum.Admin))]
        [HttpGet("trainers-and-employees")]
        public async Task<IEnumerable<GetTrainersAndEmployees.UserDto>> GetTrainersAndEmployees(string search, CancellationToken cancellationToken)
            => await Mediator.Send(new GetTrainersAndEmployees.Query() { Search = search }, cancellationToken);

        [Authorize(nameof(RoleEnum.Admin))]
        [HttpPatch("{id}/change-registration-status")]
        public async Task<ActionResult> ChangeRegistrationStatus([FromRoute] string id, ChangeRegistrationStatusRequest request, CancellationToken cancellationToken)
        {
            if (request.Role == RoleEnum.Trainer)
            {
                var trainer = await _db.Trainers.SingleOrNotFoundAsync(x => x.Id == id);
                trainer.ChangeRegistrationStatus(request.RegistrationStatus);
                await _db.SaveChangesAsync(cancellationToken);
            }
            if (request.Role == RoleEnum.Employee)
            {
                var employee = await _db.Employees.SingleOrNotFoundAsync(x => x.Id == id);
                employee.ChangeRegistrationStatus(request.RegistrationStatus);
                await _db.SaveChangesAsync(cancellationToken);
            }

            return Ok();
        }

        public class ChangeRegistrationStatusRequest
        {
            public RoleEnum Role { get; set; }
            public bool RegistrationStatus { get; set; }
        }
    }
}
