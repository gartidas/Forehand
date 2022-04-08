import { Box, Button, HStack, List, ListIcon, ListItem, Text, VStack } from '@chakra-ui/react'
import { FaCheckCircle } from 'react-icons/fa'
import { SubscriptionType } from '../../domainTypes'
import subscriptionTypeColors from '../../styles/subscriptionTypeColors'

interface SubscriptionTypeItemProps {
  type: SubscriptionType
  price: number
  perks: string[]
  button: {
    name: string
    variant: string
    onClick: () => void
    isDisabled?: boolean
  }
}

const SubscriptionTypeItem = ({ type, price, perks, button }: SubscriptionTypeItemProps) => {
  return (
    <Box
      mb={4}
      shadow='base'
      borderWidth='1px'
      alignSelf={{ base: 'center', lg: 'flex-start' }}
      borderColor={'gray.200'}
      borderRadius={'xl'}
    >
      <Box py={4} px={12}>
        <Text fontWeight='500' fontSize='2xl' color={subscriptionTypeColors[type]}>
          {SubscriptionType[type]}
        </Text>
        <HStack justifyContent='center'>
          <Text fontSize='5xl' fontWeight='900'>
            {price}
          </Text>
          <Text fontSize='3xl' fontWeight='600'>
            €
          </Text>
          <Text fontSize='3xl' color='gray.500'>
            /month
          </Text>
        </HStack>
      </Box>
      <VStack bg={subscriptionTypeColors[type]} py={4} borderBottomRadius={'xl'}>
        <List spacing={3} textAlign='start' px={12}>
          {perks.map(x => (
            <ListItem key={x}>
              <ListIcon as={FaCheckCircle} color='green.500' />
              {x}
            </ListItem>
          ))}
        </List>
        <Box w='80%' pt={7}>
          <Button
            key={button.name}
            name={button.name}
            variant={button.variant}
            onClick={button.onClick}
            isDisabled={button.isDisabled}
          >
            Buy subscription
          </Button>
        </Box>
      </VStack>
    </Box>
  )
}

export default SubscriptionTypeItem
