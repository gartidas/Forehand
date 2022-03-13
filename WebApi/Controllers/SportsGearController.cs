using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Common.Constants;
using WebApi.Features.SportsGear;

namespace WebApi.Controllers
{
    [Authorize]
    [Route("api/sports-gear")]
    public class SportsGearController : BaseController
    {
        [Authorize(nameof(RoleEnum.Employee))]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetSportsGear.SportsGearDto>>> GetSportsGear(string search, CancellationToken cancellationToken)
          => await Mediator.Send(new GetSportsGear.Query() { Search = search }, cancellationToken);

        [Authorize(nameof(RoleEnum.Employee))]
        [HttpPost]
        public async Task<ActionResult> AddSportsGear(AddSportsGear.Command command, CancellationToken cancellationToken)
        {
            await Mediator.Send(command, cancellationToken);
            return Ok();
        }

        [Authorize(nameof(RoleEnum.Employee))]
        [HttpPatch("{id}")]
        public async Task<ActionResult<GetSportsGear.SportsGearDto>> EditSportsGear([FromRoute] string id, EditSportsGear.Command command, CancellationToken cancellationToken)
        {
            command.SportsGearId = id;
            return Ok(await Mediator.Send(command, cancellationToken));
        }

        [Authorize(nameof(RoleEnum.Employee))]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteSportsGear([FromRoute] string id, CancellationToken cancellationToken)
        {
            await Mediator.Send(new DeleteSportsGear.Command { SportsGearId = id }, cancellationToken);
            return Ok();
        }
    }
}
