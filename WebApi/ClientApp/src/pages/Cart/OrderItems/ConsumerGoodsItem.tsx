import { Button, ChakraProps, Stack, Text } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { IConsumerGoods } from '../../../domainTypes'

interface ReservationItemProps extends ChakraProps {
  consumerGoods: IConsumerGoods
  onClick?: () => void
  button?: {
    name: string
    variant: string
    text?: string
    onClick: () => void
    icon?: ReactNode
    type?: 'submit' | 'reset' | 'button' | undefined
    isLoading?: boolean
    shake?: boolean
  }
}

const ConsumerGoodsItem = ({ consumerGoods, onClick, button, ...rest }: ReservationItemProps) => {
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
      justifyContent='space-between'
      width='full'
      {...rest}
    >
      <Stack
        spacing={0}
        align={'center'}
        cursor={onClick ? 'pointer' : 'default'}
        onClick={onClick}
      >
        <Text fontSize={'sm'} color={'tertiary'}>
          Product
        </Text>
        <Text
          fontWeight={600}
          wordBreak='break-word'
        >{`${consumerGoods.name} by ${consumerGoods.manufacturer}`}</Text>
      </Stack>
      <Stack spacing={0} align={'center'}>
        <Text fontSize={'sm'} color={'tertiary'}>
          Price
        </Text>
        <Text fontWeight={600}>{`${consumerGoods.price} €`}</Text>
      </Stack>
      {button && (
        <Button
          key={button.name}
          name={button.name}
          variant={button.variant}
          onClick={button.onClick}
          type={button.type}
          isLoading={button.isLoading}
        >
          {button.text}
          {button.icon}
        </Button>
      )}
    </Stack>
  )
}

export default ConsumerGoodsItem
