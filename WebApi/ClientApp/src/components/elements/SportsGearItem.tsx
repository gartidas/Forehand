import { Text, Stack } from '@chakra-ui/layout'
import { Button, ChakraProps } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { ISportsGear, PhysicalState } from '../../domainTypes'

interface SportsGearItemProps extends ChakraProps {
  sportsGear: ISportsGear
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

const SportsGearItem = ({ sportsGear, onClick, button, ...rest }: SportsGearItemProps) => {
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
      spacing={0}
      {...rest}
    >
      <Stack
        direction={{ base: 'column', md: 'row' }}
        justifyContent='space-around'
        cursor={onClick ? 'pointer' : 'default'}
        onClick={onClick}
        flex={1}
        spacing={0}
      >
        <Stack spacing={0} align={'center'}>
          <Text fontSize={'sm'} color={'tertiary'}>
            Name
          </Text>
          <Text fontWeight={600} fontSize={'sm'}>
            {sportsGear.name}
          </Text>
        </Stack>
        <Stack spacing={0} align={'center'}>
          <Text fontSize={'sm'} color={'tertiary'}>
            Registration number
          </Text>
          <Text fontWeight={600} fontSize={'sm'}>
            {sportsGear.registrationNumber}
          </Text>
        </Stack>
      </Stack>
      <Stack
        spacing={0}
        direction={{ base: 'column', md: 'row' }}
        justifyContent='space-around'
        flex={1}
      >
        <Stack spacing={0} align={'center'}>
          <Text fontSize={'sm'} color={'tertiary'}>
            Price
          </Text>
          <Text fontWeight={600} fontSize={'sm'}>{`${sportsGear.reservationPrice} €/h`}</Text>
        </Stack>
        <Stack spacing={0} align={'center'}>
          <Text fontSize={'sm'} color={'tertiary'}>
            Physical state
          </Text>
          <Text fontWeight={600} fontSize={'sm'}>
            {PhysicalState[sportsGear.physicalState]}
          </Text>
        </Stack>
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

export default SportsGearItem
