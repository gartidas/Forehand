import api from '../../api/httpClient'
import { IApiError } from '../../api/types'
import { useQuery } from 'react-query'
import FetchError from '../../components/elements/FetchError'
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  useDisclosure
} from '@chakra-ui/react'
import { FiRefreshCcw } from 'react-icons/fi'
import { useState } from 'react'
import useDebounce from '../../utils/hooks/useDebounce'
import { AddIcon, SearchIcon } from '@chakra-ui/icons'
import { ISportsGear } from '../../domainTypes'
import SportsGearItem from '../../components/elements/SportsGearItem'
import SportsGearDetail from './SportsGearDetail'

const SportsGear = () => {
  const [sportsGear, setSportsGear] = useState<ISportsGear>()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const { data, isLoading, error, refetch, isFetching } = useQuery<ISportsGear[], IApiError>(
    ['sports-gear', debouncedSearch],
    async () => (await api.get(`/sports-gear?search=${encodeURIComponent(debouncedSearch)}`)).data
  )

  if (error) return <FetchError error={error} />
  if (isLoading || !data) return <Spinner thickness='4px' color='primary' size='xl' mt='30px' />

  return (
    <>
      <Flex alignItems='center' marginTop={3}>
        <InputGroup marginRight={2}>
          <InputLeftElement pointerEvents='none' children={<SearchIcon color='primary' />} />
          <Input
            value={search}
            onChange={e => setSearch(e.currentTarget.value)}
            backgroundColor='bg2'
            borderRadius='lg'
          />
        </InputGroup>
        <Button
          aria-label='Refresh'
          isLoading={isFetching}
          onClick={() => refetch()}
          variant='primary'
          border='1px solid'
          borderColor='inherit'
          marginRight={2}
        >
          <FiRefreshCcw />
        </Button>
        <Button
          aria-label='Add'
          variant='secondary'
          border='1px solid'
          borderColor='inherit'
          onClick={onOpen}
        >
          <AddIcon />
        </Button>
      </Flex>
      <Flex gap={3} mt={4} direction='column'>
        {data.map(x => (
          <SportsGearItem
            key={x.id}
            sportsGear={x}
            onClick={() => {
              setSportsGear(x)
              onOpen()
            }}
          />
        ))}
      </Flex>

      {!isFetching && data.length === 0 && <Box marginTop={3}>Nothing found</Box>}

      {isOpen && (
        <SportsGearDetail
          isOpen={isOpen}
          onClose={() => {
            onClose()
            setSportsGear(undefined)
          }}
          sportsGear={sportsGear}
          refetch={refetch}
        />
      )}
    </>
  )
}

export default SportsGear
