using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Common.Constants;
using WebApi.Features.ConsumerGoods;

namespace WebApi.Controllers
{
    [Authorize]
    [Route("api/consumer-goods")]
    public class ConsumerGoodsController : BaseController
    {
        [Authorize(nameof(RoleEnum.Employee))]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetConsumerGoods.ConsumerGoodsDto>>> GetConsumerGoods(string search, CancellationToken cancellationToken)
         => await Mediator.Send(new GetConsumerGoods.Query() { Search = search }, cancellationToken);

        [Authorize(nameof(RoleEnum.Employee))]
        [HttpPost]
        public async Task<ActionResult> AddConsumerGoods(AddConsumerGoods.Command command, CancellationToken cancellationToken)
        {
            await Mediator.Send(command, cancellationToken);
            return Ok();
        }

        [Authorize(nameof(RoleEnum.Employee))]
        [HttpPatch("{id}")]
        public async Task<ActionResult<GetConsumerGoods.ConsumerGoodsDto>> EditConsumerGoods([FromRoute] string id, EditConsumerGoods.Command command, CancellationToken cancellationToken)
        {
            command.ConsumerGoodsId = id;
            return Ok(await Mediator.Send(command, cancellationToken));
        }

        [Authorize(nameof(RoleEnum.Employee))]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteConsumerGoods([FromRoute] string id, CancellationToken cancellationToken)
        {
            await Mediator.Send(new DeleteConsumerGoods.Command { ConsumerGoodsId = id }, cancellationToken);
            return Ok();
        }
    }
}
