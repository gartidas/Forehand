import { Spinner, Stack, useBreakpointValue } from '@chakra-ui/react'
import { useQuery } from 'react-query'
import { IApiError } from '../../../api/types'
import api from '../../../api/httpClient'
import FetchError from '../../../components/elements/FetchError'
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'

interface IDayStatistics {
  hourOfDay: number
  numberOfReservations: number
}

const TimePreference = () => {
  const width = useBreakpointValue({ base: 420, md: 600, lg: 1000 })
  const height = useBreakpointValue({ base: 420, lg: 500 })
  const { data, isLoading, error } = useQuery<IDayStatistics[], IApiError>(
    ['reservations', 'statistics', 'hours-of-day'],
    async () => (await api.get(`/reservations/statistics/hours-of-day`)).data
  )

  if (error) return <FetchError error={error} />
  if (isLoading || !data) return <Spinner thickness='4px' color='primary' size='xl' mt='30px' />

  const formattedData: { name: string; Reservations: number }[] = data.map(x => ({
    name: `${x.hourOfDay}:00`,
    Reservations: x.numberOfReservations
  }))

  return (
    <Stack width='full' height='full' alignItems='center' overflow='auto'>
      <BarChart
        width={width}
        height={height}
        data={formattedData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='name' />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey='Reservations' fill='#68D391' />
      </BarChart>
    </Stack>
  )
}

export default TimePreference
