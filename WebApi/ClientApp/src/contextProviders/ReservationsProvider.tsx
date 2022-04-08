import { createContext, FC, useCallback, useContext, useEffect } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { IApiError } from '../api/types'
import { IReservation, Role } from '../domainTypes'
import useHub from '../utils/hooks/useHub'
import api from '../api/httpClient'
import { useAuth } from './AuthProvider'

interface IReservationsContextValue {
  reservations?: IReservation[]
  isLoading: boolean
  error: IApiError | null
  loadCalendar: () => void
  removeReservation: (reservationId: string) => void
}

const ReservationsContext = createContext<IReservationsContextValue>(null!)
export const useReservations = () => useContext(ReservationsContext)

const ReservationsProvider: FC = ({ children }) => {
  const auth = useAuth()
  const queryClient = useQueryClient()
  const { hubConnection } = useHub('/reservations-hub')

  const { data, isLoading, error, refetch, isFetching } = useQuery<IReservation[], IApiError>(
    ['reservations', 'calendar'],
    async () => (await api.get('/reservations/calendar')).data,
    {
      staleTime: Number.POSITIVE_INFINITY,
      cacheTime: Number.POSITIVE_INFINITY,
      enabled: auth.isLoggedIn && auth.currentUser.role === Role.BasicUser,
      keepPreviousData: true
    }
  )

  const receiveReservation = useCallback(
    (reservation: IReservation) => {
      queryClient.setQueryData<IReservation[]>(['reservations', 'calendar'], prev => [
        ...(prev || []),
        reservation
      ])
    },
    [queryClient]
  )

  const removeReservation = useCallback(
    async (reservationId: string) => {
      queryClient.setQueryData<IReservation[]>(['reservations', 'calendar'], prev =>
        prev!.filter(reservation => reservation.id !== reservationId)
      )
    },
    [queryClient]
  )

  useEffect(() => {
    if (!hubConnection) return
    hubConnection.on('ReceiveReservation', receiveReservation)
    hubConnection.on('RemoveReservation', removeReservation)

    return () => {
      hubConnection.off('ReceiveReservation')
      hubConnection.off('RemoveReservation')
    }
  }, [hubConnection, receiveReservation, removeReservation])

  const value: IReservationsContextValue = {
    error,
    isLoading: isLoading || isFetching,
    reservations: data,
    loadCalendar: () => refetch,
    removeReservation
  }

  return <ReservationsContext.Provider value={value}>{children}</ReservationsContext.Provider>
}

export default ReservationsProvider
