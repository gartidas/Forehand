import { IReservation } from '../../domainTypes'
import { EventInput, EventSourceInput } from '@fullcalendar/react'
import reservationStateColors from '../../styles/reservationStateColors'

export const mapReservationsToCalendar = (reservations: IReservation[]): EventSourceInput => {
  const events: EventInput[] = []

  reservations.forEach(reservation => {
    events.push({
      id: reservation.id,
      title: reservation.customer.email,
      extendedProps: {
        trainer: reservation.trainer && reservation.trainer.email,
        court: reservation.court.label,
        customer: reservation.customer.id
      },
      color: reservationStateColors[reservation.reservationState],
      start: reservation.startDate,
      end: reservation.endDate
    })
  })

  return events
}

export const roundToHalf = (number: number) => Math.round(number * 2) / 2
