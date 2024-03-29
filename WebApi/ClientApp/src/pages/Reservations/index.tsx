import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import momentPlugin from '@fullcalendar/moment'
import { Box, Spinner } from '@chakra-ui/react'
import { NAVBAR_HEIGHT } from '../../components/modules/Navbar/Navbar'
import useWindowSize from '../../utils/hooks/useWindowsSize'
import { useNavigate } from 'react-router'
import reservationStateColors from '../../styles/reservationStateColors'
import { ReservationState } from '../../domainTypes'
import ReservationItem from '../../components/elements/ReservationItem'
import { toFormattedDate } from '../../utils'
import { useReservations } from '../../contextProviders/ReservationsProvider'
import FetchError from '../../components/elements/FetchError'
import { mapReservationsToCalendar } from './utils'
import { useAuthorizedUser } from '../../contextProviders/AuthProvider'
import { errorToast } from '../../services/toastService'

const Reservations = () => {
  const { currentUser } = useAuthorizedUser()
  const { reservations, error, isLoading } = useReservations()
  const navigate = useNavigate()
  const isDesktop = useWindowSize().width > 1200

  if (error) return <FetchError error={error} />
  if (isLoading || !reservations)
    return <Spinner thickness='4px' color='primary' size='xl' mt='30px' />

  return (
    <Box height={`calc(100vh - ${NAVBAR_HEIGHT})`}>
      <FullCalendar
        plugins={[momentPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: '',
          center: 'title'
        }}
        initialView={isDesktop ? 'timeGridWeek' : 'timeGridDay'}
        editable={false}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        events={mapReservationsToCalendar(reservations)}
        height='95%'
        titleFormat={{ month: 'long', year: 'numeric' }}
        views={{ week: { dayHeaderFormat: { weekday: 'long', day: 'numeric' } } }}
        firstDay={1}
        eventClick={({ event }) => {
          const { _def } = event
          const { extendedProps } = _def

          extendedProps.customer === currentUser.id
            ? navigate(`/reservations/${event.id}`)
            : errorToast('NotCurrentUsersEvent')
        }}
        eventColor={reservationStateColors[ReservationState.Planned]}
        eventContent={blockEvent => <ReservationItem {...blockEvent} />}
        select={event =>
          navigate(
            `/reservations/new/${toFormattedDate(event.start)}/${toFormattedDate(event.end)}`
          )
        }
        allDaySlot={false}
        businessHours={{
          startTime: '7:00',
          endTime: '21:00',
          daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
        }}
        selectConstraint='businessHours'
        slotLabelFormat='H'
        validRange={{ start: new Date() }}
      />
    </Box>
  )
}

export default Reservations
