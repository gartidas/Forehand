import { Box, Heading, Stack, Text, VStack } from '@chakra-ui/react'
import moment from 'moment'
import { useAuthorizedUser } from '../../contextProviders/AuthProvider'
import { useOrders } from '../../contextProviders/OrdersProvider'
import { ISubscriptionCard, SubscriptionType } from '../../domainTypes'
import { errorToast, successToast } from '../../services/toastService'
import { toFormattedDate } from '../../utils'
import SubscriptionTypeItem from './SubscriptionTypeItem'

const SUBSCRIPTION_TYPES: ISubscriptionCard[] = [
  {
    id: SubscriptionType[SubscriptionType.Basic],
    price: 10,
    dueDate: toFormattedDate(moment().add(1, 'month').toString(), 'yyyy-MM-DDTHH:mm:ss'),
    subscriptionType: SubscriptionType.Basic
  },
  {
    id: SubscriptionType[SubscriptionType.Silver],
    price: 30,
    dueDate: toFormattedDate(moment().add(1, 'month').toString(), 'yyyy-MM-DDTHH:mm:ss'),
    subscriptionType: SubscriptionType.Silver
  },
  {
    id: SubscriptionType[SubscriptionType.Gold],
    price: 50,
    dueDate: toFormattedDate(moment().add(1, 'month').toString(), 'yyyy-MM-DDTHH:mm:ss'),
    subscriptionType: SubscriptionType.Gold
  }
]

const SubscriptionCards = () => {
  const { currentUser } = useAuthorizedUser()
  const { addSubscriptionCard, subscriptionCard } = useOrders()

  const buySubscriptionCard = (type: SubscriptionType) => {
    const typeDto = SUBSCRIPTION_TYPES.find(x => x.id === SubscriptionType[type])
    if (!typeDto) {
      errorToast(`${SubscriptionType[type]} not supported.`)
      return
    }

    addSubscriptionCard(typeDto)
    successToast('Subscription card added to cart')
  }

  return (
    <Box py={12}>
      <VStack spacing={2} textAlign='center'>
        <Heading as='h1' fontSize='4xl'>
          Plans that fit your need
        </Heading>
        <Text fontSize='lg' color={'gray.500'}>
          Buy a subscription card and never worry about money again.
        </Text>
      </VStack>
      <Stack
        direction={{ base: 'column', md: 'row' }}
        textAlign='center'
        justify='center'
        spacing={{ base: 4, lg: 10 }}
        py={10}
      >
        <SubscriptionTypeItem
          type={SubscriptionType.Basic}
          price={10}
          perks={['Free court reservations']}
          button={{
            name: 'buy',
            variant: 'primary',
            onClick: () => buySubscriptionCard(SubscriptionType.Basic),
            isDisabled: subscriptionCard !== null || currentUser.subscriptionCard !== undefined
          }}
        />
        <SubscriptionTypeItem
          type={SubscriptionType.Silver}
          price={30}
          perks={['Free court reservations', 'Free trainer reservations']}
          button={{
            name: 'buy',
            variant: 'primary',
            onClick: () => buySubscriptionCard(SubscriptionType.Silver),
            isDisabled: subscriptionCard !== null || currentUser.subscriptionCard !== undefined
          }}
        />
        <SubscriptionTypeItem
          type={SubscriptionType.Gold}
          price={50}
          perks={[
            'Free court reservations',
            'Free trainer reservations',
            'Free sports gear reservations'
          ]}
          button={{
            name: 'buy',
            variant: 'primary',
            onClick: () => buySubscriptionCard(SubscriptionType.Gold),
            isDisabled: subscriptionCard !== null || currentUser.subscriptionCard !== undefined
          }}
        />
      </Stack>
    </Box>
  )
}

export default SubscriptionCards
