using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Common.Constants;
using WebApi.Features.GiftCards;
namespace WebApi.Controllers
{
    [Authorize]
    [Route("api/gift-cards")]
    public class GiftCardsController : BaseController
    {
        [Authorize(nameof(RoleEnum.Employee))]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GetGiftCards.GiftCardDto>>> GetGiftCards(string search, CancellationToken cancellationToken)
         => await Mediator.Send(new GetGiftCards.Query() { Search = search }, cancellationToken);

        [Authorize(nameof(RoleEnum.Employee))]
        [HttpPost]
        public async Task<ActionResult> AddGiftCard(AddGiftCard.Command command, CancellationToken cancellationToken)
        {
            await Mediator.Send(command, cancellationToken);
            return Ok();
        }

        [Authorize(nameof(RoleEnum.Employee))]
        [HttpPatch("{id}")]
        public async Task<ActionResult<GetGiftCards.GiftCardDto>> EditGiftCard([FromRoute] string id, EditGiftCard.Command command, CancellationToken cancellationToken)
        {
            command.GiftCardId = id;
            return Ok(await Mediator.Send(command, cancellationToken));
        }

        [Authorize(nameof(RoleEnum.Employee))]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteGiftCard([FromRoute] string id, CancellationToken cancellationToken)
        {
            await Mediator.Send(new DeleteGiftCard.Command { GiftCardId = id }, cancellationToken);
            return Ok();
        }
    }
}
