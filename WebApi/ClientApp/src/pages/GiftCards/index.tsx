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
import { IGiftCard, Role } from '../../domainTypes'
import GiftCardsItem from '../../components/elements/GiftCardsItem'
import GiftCardDetail from './GiftCardDetail'
import { useAuthorizedUser } from '../../contextProviders/AuthProvider'
import { useOrders } from '../../contextProviders/OrdersProvider'

const GiftCards = () => {
  const { giftCards: giftCardsInCart } = useOrders()
  const { currentUser } = useAuthorizedUser()
  const [giftCard, setGiftCard] = useState<IGiftCard>()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const { data, isLoading, error, refetch, isFetching } = useQuery<IGiftCard[], IApiError>(
    ['gift-cards', debouncedSearch],
    async () => (await api.get(`/gift-cards?search=${encodeURIComponent(debouncedSearch)}`)).data
  )

  if (error) return <FetchError error={error} />
  if (isLoading || !data) return <Spinner thickness='4px' color='primary' size='xl' mt='30px' />

  const filteredData = giftCardsInCart
    ? data.filter(x => giftCardsInCart.find(y => y.id === x.id) === undefined)
    : data

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
        {currentUser.role !== Role.BasicUser && (
          <Button
            aria-label='Add'
            variant='secondary'
            border='1px solid'
            borderColor='inherit'
            onClick={onOpen}
          >
            <AddIcon />
          </Button>
        )}
      </Flex>
      <Flex gap={3} mt={4} direction='column'>
        {filteredData.map(x => (
          <GiftCardsItem
            key={x.id}
            giftCard={x}
            onClick={() => {
              setGiftCard(x)
              onOpen()
            }}
          />
        ))}
      </Flex>

      {!isFetching && filteredData.length === 0 && <Box marginTop={3}>Nothing found</Box>}

      {isOpen && (
        <GiftCardDetail
          isOpen={isOpen}
          onClose={() => {
            onClose()
            setGiftCard(undefined)
          }}
          giftCard={giftCard}
          refetch={refetch}
        />
      )}
    </>
  )
}

export default GiftCards
