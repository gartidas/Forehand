import { IUser } from '../../domainTypes'
import api from '../../api/httpClient'
import { IApiError } from '../../api/types'
import { useQuery } from 'react-query'
import FetchError from '../../components/elements/FetchError'
import { Box, Button, Flex, Input, InputGroup, InputLeftElement, Spinner } from '@chakra-ui/react'
import { FiRefreshCcw } from 'react-icons/fi'
import UserItem from '../../components/elements/UserItem'
import { useState } from 'react'
import useDebounce from '../../utils/hooks/useDebounce'
import { SearchIcon } from '@chakra-ui/icons'

const Users = () => {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const { data, isLoading, error, refetch, isFetching } = useQuery<IUser[], IApiError>(
    ['users', 'trainers-and-employees', debouncedSearch],
    async () =>
      (await api.get(`/users/trainers-and-employees?search=${encodeURIComponent(debouncedSearch)}`))
        .data
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
        >
          <FiRefreshCcw />
        </Button>
      </Flex>
      <Flex gap={3} mt={4} direction='column'>
        {data.map(x => (
          <UserItem key={x.id} user={x} onButtonClick={refetch} />
        ))}
      </Flex>

      {!isFetching && data.length === 0 && <Box marginTop={3}>Nothing found</Box>}
    </>
  )
}

export default Users
