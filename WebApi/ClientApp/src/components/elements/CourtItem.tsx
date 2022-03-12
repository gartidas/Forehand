import { Text, Stack } from '@chakra-ui/layout'
import { ChakraProps } from '@chakra-ui/react'
import { ICourt } from '../../domainTypes'

interface CourtItemProps extends ChakraProps {
  court: ICourt
  onClick: () => void
}

const CourtItem = ({ court, onClick, ...rest }: CourtItemProps) => {
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
      <Stack spacing={0} align={'center'}>
        <Text fontSize={'sm'} color={'tertiary'}>
          Description
        </Text>
        <Text fontWeight={600}>
          {court.description.slice(0, 6).replace(',', '').trim().concat('...')}
        </Text>
      </Stack>
    </Stack>
  )
}

export default CourtItem
