import { Spinner, Stack, useBreakpointValue } from '@chakra-ui/react'
import { useQuery } from 'react-query'
import { IApiError } from '../../../api/types'
import api from '../../../api/httpClient'
import FetchError from '../../../components/elements/FetchError'
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'

interface IDayStatistics {
  dayOfWeek: DayOfWeek
  numberOfReservations: number
}

enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6
}

const DayPreference = () => {
  const width = useBreakpointValue({ base: 420, md: 600, lg: 1000 })
  const height = useBreakpointValue({ base: 420, lg: 500 })
  const { data, isLoading, error } = useQuery<IDayStatistics[], IApiError>(
    ['reservations', 'statistics', 'days-of-week'],
    async () => (await api.get(`/reservations/statistics/days-of-week`)).data
  )

  if (error) return <FetchError error={error} />
  if (isLoading || !data) return <Spinner thickness='4px' color='primary' size='xl' mt='30px' />

  const firstItem = data.find(x => x.dayOfWeek === 0)
  const sortedData = data.slice(1).concat(firstItem!)

  const formattedData: { name: string; Reservations: number }[] = sortedData.map(x => ({
    name: DayOfWeek[x.dayOfWeek],
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

export default DayPreference
