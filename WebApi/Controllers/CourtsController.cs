using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Common.Constants;
using WebApi.Features.Courts;

namespace WebApi.Controllers
{
    [Authorize]
    [Route("api/courts")]
    public class CourtsController : BaseController
    {
        [Authorize(nameof(RoleEnum.Employee))]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetCourts.CourtDto>>> GetCourts(string search, CancellationToken cancellationToken)
           => await Mediator.Send(new GetCourts.Query() { Search = search }, cancellationToken);

        [Authorize(nameof(RoleEnum.Employee))]
        [HttpGet("{id}")]
        public async Task<ActionResult<GetCourts.CourtDto>> GetCourt([FromRoute] string id, CancellationToken cancellationToken)
           => await Mediator.Send(new GetCourt.Query() { CourtId = id }, cancellationToken);

        [Authorize(nameof(RoleEnum.Employee))]
        [HttpPost]
        public async Task<ActionResult> AddCourt(AddCourt.Command command, CancellationToken cancellationToken)
        {
            await Mediator.Send(command, cancellationToken);
            return Ok();
        }

        [Authorize(nameof(RoleEnum.Employee))]
        [HttpPatch("{id}")]
        public async Task<ActionResult<GetCourts.CourtDto>> EditCourt([FromRoute] string id, EditCourt.Command command, CancellationToken cancellationToken)
        {
            command.CourtId = id;
            return Ok(await Mediator.Send(command, cancellationToken));
        }

        [Authorize(nameof(RoleEnum.Employee))]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCourt([FromRoute] string id, CancellationToken cancellationToken)
        {
            await Mediator.Send(new DeleteCourt.Command { CourtId = id }, cancellationToken);
            return Ok();
        }
    }
}
