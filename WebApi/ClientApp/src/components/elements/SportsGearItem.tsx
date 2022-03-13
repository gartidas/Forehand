import { Text, Stack } from '@chakra-ui/layout'
import { ChakraProps } from '@chakra-ui/react'
import { ISportsGear, PhysicalState } from '../../domainTypes'

interface SportsGearItemProps extends ChakraProps {
  sportsGear: ISportsGear
  onClick: () => void
}

const SportsGearItem = ({ sportsGear, onClick, ...rest }: SportsGearItemProps) => {
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
      <Stack direction={{ base: 'column', md: 'row' }} width='50%' justifyContent='space-around'>
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
    </Stack>
  )
}

export default SportsGearItem
