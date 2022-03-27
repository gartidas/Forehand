﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Common.Constants;
using WebApi.Features.Reservations;
using WebApi.Features.Reservations.ReservationItems;
using static WebApi.Features.Courts.GetCourts;
using static WebApi.Features.SportsGear.GetSportsGear;
using static WebApi.Features.Users.GetUser;

namespace WebApi.Controllers
{
    [Authorize]
    [Route("api/reservations")]
    public class ReservationsController : BaseController
    {
        [Authorize(nameof(RoleEnum.BasicUser))]
        [HttpGet("calendar")]
        public async Task<ActionResult<IEnumerable<ReservationDto>>> GetReservations(CancellationToken cancellationToken)
          => await Mediator.Send(new GetReservations.Query(), cancellationToken);

        [Authorize(nameof(RoleEnum.Trainer))]
        [HttpGet("calendar/trainers/{id}")]
        public async Task<ActionResult<IEnumerable<ReservationDto>>> GetReservationsForTrainer([FromRoute] string id, CancellationToken cancellationToken)
        => await Mediator.Send(new GetReservationsForTrainer.Query() { TrainerId = id }, cancellationToken);

        [Authorize()]
        [HttpGet("{id}")]
        public async Task<ActionResult<ReservationDto>> GetReservation([FromRoute] string id, CancellationToken cancellationToken)
           => await Mediator.Send(new GetReservation.Query() { ReservationId = id }, cancellationToken);

        [Authorize(nameof(RoleEnum.BasicUser))]
        [HttpPost]
        public async Task<ActionResult<ReservationDto>> AddReservation(AddReservation.Command command, CancellationToken cancellationToken)
        {
            command.CustomerId = CurrentUserService.UserId;
            return Ok(await Mediator.Send(command, cancellationToken));
        }

        [Authorize(nameof(RoleEnum.BasicUser))]
        [HttpPatch("{id}")]
        public async Task<ActionResult<ReservationDto>> EditReservation([FromRoute] string id, EditReservation.Command command, CancellationToken cancellationToken)
        {
            command.CustomerId = CurrentUserService.UserId;
            command.ReservationId = id;
            return Ok(await Mediator.Send(command, cancellationToken));
        }

        [Authorize(nameof(RoleEnum.BasicUser))]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteReservation([FromRoute] string id, CancellationToken cancellationToken)
        {
            await Mediator.Send(new DeleteReservation.Command { ReservationId = id }, cancellationToken);
            return Ok();
        }

        [Authorize(nameof(RoleEnum.BasicUser))]
        [HttpPost("items/courts")]
        public async Task<ActionResult<IEnumerable<CourtDto>>> GetCourtsWithoutReservation(GetCourtsWithoutReservation.Query query, CancellationToken cancellationToken)
         => await Mediator.Send(query, cancellationToken);

        [Authorize(nameof(RoleEnum.BasicUser))]
        [HttpPost("items/trainers")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetTrainersWithoutReservation(GetTrainersWithoutReservation.Query query, CancellationToken cancellationToken)
        => await Mediator.Send(query, cancellationToken);

        [Authorize(nameof(RoleEnum.BasicUser))]
        [HttpPost("items/sportsGear")]
        public async Task<ActionResult<IEnumerable<SportsGearDto>>> GetSportsGearWithoutReservation(GetSportsGearWithoutReservation.Query query, CancellationToken cancellationToken)
        => await Mediator.Send(query, cancellationToken);
    }
}
