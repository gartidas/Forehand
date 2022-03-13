using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Domain;
using WebApi.Persistence;

namespace WebApi.Features.SportsGear
{
    public class GetSportsGear
    {
        public class Query : IRequest<List<SportsGearDto>>
        {
            [JsonIgnore]
            public string Search { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<SportsGearDto>>
        {
            private readonly ForehandContext _db;

            public Handler(ForehandContext db)
            {
                _db = db;
            }

            public async Task<List<SportsGearDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                if (request.Search is null)
                    return await _db.SportsGear
                    .Select(x => new SportsGearDto
                    {
                        Id = x.Id,
                        ReservationPrice = x.ReservationPrice,
                        RegistrationDate = x.RegistrationDate,
                        RegistrationNumber = x.RegistrationNumber,
                        ShoppingPrice = x.ShoppingPrice,
                        Name = x.Name,
                        ProductionYear = x.ProductionYear,
                        PhysicalState = x.PhysicalState,
                        Manufacturer = x.Manufacturer,
                    })
                    .OrderBy(x => x.Name)
                    .ToListAsync(cancellationToken);

                return await _db.SportsGear
                    .Where(x => (x.Name).Contains(request.Search) || (x.RegistrationNumber).Contains(request.Search))
                    .Select(x => new SportsGearDto
                    {
                        Id = x.Id,
                        ReservationPrice = x.ReservationPrice,
                        RegistrationDate = x.RegistrationDate,
                        RegistrationNumber = x.RegistrationNumber,
                        ShoppingPrice = x.ShoppingPrice,
                        Name = x.Name,
                        ProductionYear = x.ProductionYear,
                        PhysicalState = x.PhysicalState,
                        Manufacturer = x.Manufacturer,
                    })
                    .OrderBy(x => x.Name)
                    .ToListAsync(cancellationToken);
            }
        }

        public class SportsGearDto
        {
            public string Id { get; set; }

            public double ReservationPrice { get; set; }

            public DateTime RegistrationDate { get; set; }

            public string RegistrationNumber { get; set; }

            public double ShoppingPrice { get; set; }

            public string Name { get; set; }

            public DateTime ProductionYear { get; set; }

            public PhysicalState PhysicalState { get; set; }

            public string Manufacturer { get; set; }
        }
    }
}
