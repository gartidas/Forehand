import { Text, Stack } from '@chakra-ui/layout'
import { Button, ChakraProps, Tooltip } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { ICourt } from '../../domainTypes'

interface CourtItemProps extends ChakraProps {
  court: ICourt
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

const CourtItem = ({ court, onClick, button, ...rest }: CourtItemProps) => {
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
          Label
        </Text>
        <Text fontWeight={600}>{court.label}</Text>
      </Stack>
      <Stack spacing={0} align={'center'}>
        <Text fontSize={'sm'} color={'tertiary'}>
          Price
        </Text>
        <Text fontWeight={600}>{`${court.reservationPrice} €/h`}</Text>
      </Stack>
      <Tooltip label={court.description} backgroundColor='secondary'>
        <Stack spacing={0} align={'center'}>
          <Text fontSize={'sm'} color={'tertiary'}>
            Description
          </Text>
          <Text fontWeight={600}>
            {court.description.slice(0, 6).replace(',', '').trim().concat('...')}
          </Text>
        </Stack>
      </Tooltip>
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

export default CourtItem
