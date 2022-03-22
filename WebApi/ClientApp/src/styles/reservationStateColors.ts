import { ReservationState } from '../domainTypes'

const reservationStateColors = {
  [ReservationState.Confirmed]: '#68D391',
  [ReservationState.Declined]: '#FC8181',
  [ReservationState.Fulfilled]: '#718096',
  [ReservationState.NotFulfilled]: 'black',
  [ReservationState.Planned]: '#76E4F7',
  [ReservationState.Unknown]: 'white'
}

export default reservationStateColors
