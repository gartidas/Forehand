import { Cell, Pie, PieChart } from 'recharts'
import { IUserExtended } from '../../../domainTypes'
import api from '../../../api/httpClient'
import FetchError from '../../../components/elements/FetchError'
import { Spinner, Stack, useBreakpointValue } from '@chakra-ui/react'
import { useQuery } from 'react-query'
import { IApiError } from '../../../api/types'
import { getRandomColor } from '../utils'
import ChartLabel from './ChartLabel'

interface ITrainerStatistics {
  trainer: IUserExtended
  numberOfReservations: number
}

const Trainers = () => {
  const width = useBreakpointValue({ base: 300, md: 600, lg: 1000 })
  const height = useBreakpointValue({ base: 420, lg: 500 })
  const radius = useBreakpointValue({ base: 90, md: 140, lg: 200 })

  const { data, isLoading, error } = useQuery<ITrainerStatistics[], IApiError>(
    ['reservations', 'statistics', 'trainers'],
    async () => (await api.get(`/reservations/statistics/trainers`)).data
  )

  if (error) return <FetchError error={error} />
  if (isLoading || !data) return <Spinner thickness='4px' color='primary' size='xl' mt='30px' />

  const formattedData: { name: string; value: number }[] = data.map(x => ({
    name: `${x.trainer.givenName} ${x.trainer.surname}`,
    value: x.numberOfReservations
  }))

  return (
    <Stack width='full' height='full' alignItems='center' overflow='auto'>
      <PieChart width={width} height={height}>
        <Pie
          data={formattedData}
          dataKey='value'
          cx='50%'
          cy='50%'
          outerRadius={radius}
          fill='#68D391'
          label={ChartLabel}
          labelLine={false}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={getRandomColor()} />
          ))}
        </Pie>
      </PieChart>
    </Stack>
  )
}

export default Trainers
