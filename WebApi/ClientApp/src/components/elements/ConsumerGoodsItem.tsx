import { Text, Stack } from '@chakra-ui/layout'
import { ChakraProps } from '@chakra-ui/react'
import { IConsumerGoods } from '../../domainTypes'

interface ConsumerGoodsItemProps extends ChakraProps {
  consumerGoods: IConsumerGoods
  onClick: () => void
}

const ConsumerGoodsItem = ({ consumerGoods, onClick, ...rest }: ConsumerGoodsItemProps) => {
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
      <Stack spacing={0} align={'center'} cursor='pointer' onClick={onClick}>
        <Text fontSize={'sm'} color={'tertiary'}>
          Name
        </Text>
        <Text fontWeight={600}>{consumerGoods.name}</Text>
      </Stack>
      <Stack spacing={0} align={'center'}>
        <Text fontSize={'sm'} color={'tertiary'}>
          Price
        </Text>
        <Text fontWeight={600}>{`${consumerGoods.price} €`}</Text>
      </Stack>
      <Stack spacing={0} align={'center'}>
        <Text fontSize={'sm'} color={'tertiary'}>
          Manufacturer
        </Text>
        <Text fontWeight={600}>{consumerGoods.manufacturer}</Text>
      </Stack>
    </Stack>
  )
}

export default ConsumerGoodsItem
