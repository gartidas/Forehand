import { createContext, FC, useCallback, useContext, useEffect, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { IApiError } from '../api/types'
import { IReservation } from '../domainTypes'
import useHub from '../utils/hooks/useHub'
import api from '../api/httpClient'
import moment from 'moment'
import { useAuth } from './AuthProvider'
import { formatDateForInput } from '../utils'

interface IReservationsContextValue {
  reservations?: IReservation[]
  isLoading: boolean
  error: IApiError | null
  fromDate: string
  toDate: string
  loadWeek: (fromDate: string, toDate: string) => void
  removeReservation: (reservationId: string) => void
}

const ReservationsContext = createContext<IReservationsContextValue>(null!)
export const useReservations = () => useContext(ReservationsContext)

const ReservationsProvider: FC = ({ children }) => {
  const auth = useAuth()
  const queryClient = useQueryClient()
  const { hubConnection } = useHub('/reservations-hub')
  const [fromDate, setFromDate] = useState<string>(
    formatDateForInput(moment().weekday(1).toString())
  )
  const [toDate, setToDate] = useState<string>(formatDateForInput(moment().weekday(7).toString()))

  const { data, isLoading, error, refetch, isFetching } = useQuery<IReservation[], IApiError>(
    ['reservations', 'calendar', fromDate, toDate],
    async () =>
      (await api.post('/reservations/calendar', { fromDate: fromDate, toDate: toDate })).data,
    {
      staleTime: Number.POSITIVE_INFINITY,
      cacheTime: Number.POSITIVE_INFINITY,
      enabled: auth.isLoggedIn,
      keepPreviousData: true
    }
  )

  const receiveReservation = useCallback(
    (reservation: IReservation) => {
      if (reservation.startDate < toDate && reservation.endDate > fromDate)
        queryClient.setQueryData<IReservation[]>(
          ['reservations', 'calendar', fromDate, toDate],
          prev => ({ ...prev!, reservation })
        )
    },
    [toDate, fromDate, queryClient]
  )

  const removeReservation = useCallback(
    async (reservationId: string) => {
      queryClient.setQueryData<IReservation[]>(
        ['reservations', 'calendar', fromDate, toDate],
        prev => prev!.filter(reservation => reservation.id !== reservationId)
      )
    },
    [queryClient, toDate, fromDate]
  )

  const loadWeek = useCallback(
    (fromDate: string, toDate: string) => {
      setFromDate(fromDate)
      setToDate(toDate)
      refetch()
    },
    [refetch]
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
    fromDate: fromDate,
    toDate: toDate,
    isLoading: isLoading || isFetching,
    reservations: data ? data : undefined,
    loadWeek,
    removeReservation
  }

  return <ReservationsContext.Provider value={value}>{children}</ReservationsContext.Provider>
}

export default ReservationsProvider
