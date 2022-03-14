import { Text, Stack } from '@chakra-ui/layout'
import { ChakraProps } from '@chakra-ui/react'
import { IGiftCard } from '../../domainTypes'

interface GiftCardsItemProps extends ChakraProps {
  giftCard: IGiftCard
  onClick: () => void
}

const GiftCardsItem = ({ giftCard, onClick, ...rest }: GiftCardsItemProps) => {
  return (
    <Stack
      my={1}
      rounded={'lg'}
      boxShadow={'lg'}
      borderRadius='lg'
      p={3}
      direction='row'
      alignItems='center'
      backgroundColor='bg2'
      justifyContent='space-around'
      width='full'
      {...rest}
    >
      <Stack
        direction={{ base: 'column', md: 'row' }}
        width='50%'
        justifyContent='space-around'
        cursor='pointer'
        onClick={onClick}
      >
        <Stack spacing={0} align={'center'}>
          <Text fontSize={'sm'} color={'tertiary'}>
            Name
          </Text>
          <Text fontWeight={600} fontSize={'sm'}>
            {giftCard.name}
          </Text>
        </Stack>
        <Stack spacing={0} align={'center'}>
          <Text fontSize={'sm'} color={'tertiary'}>
            Code
          </Text>
          <Text fontWeight={600} fontSize={'sm'}>
            {giftCard.code}
          </Text>
        </Stack>
      </Stack>
      <Stack direction={{ base: 'column', md: 'row' }} width='50%' justifyContent='space-around'>
        <Stack spacing={0} align={'center'}>
          <Text fontSize={'sm'} color={'tertiary'}>
            Price
          </Text>
          <Text fontWeight={600} fontSize={'sm'}>{`${giftCard.price} €`}</Text>
        </Stack>
        <Stack spacing={0} align={'center'}>
          <Stack spacing={0} align={'center'}>
            <Text fontSize={'sm'} color={'tertiary'}>
              Value
            </Text>
            <Text fontWeight={600} fontSize={'sm'}>{`${giftCard.value} €`}</Text>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default GiftCardsItem
