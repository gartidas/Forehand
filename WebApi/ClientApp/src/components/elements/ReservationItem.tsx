import { EventContentArg } from '@fullcalendar/react'
import { Avatar, Heading, Stack, Text } from '@chakra-ui/react'
import roleColors from '../../styles/roleColors'
import { useAuthorizedUser } from '../../contextProviders/AuthProvider'
import { Role } from '../../domainTypes'
import { toFormattedDate } from '../../utils'
import { roundToHalf } from '../../pages/Reservations/utils'

const ReservationItem = ({ event }: EventContentArg) => {
  const { currentUser } = useAuthorizedUser()
  const { _def, start, end } = event
  const { title, extendedProps } = _def
  const duration = end!.valueOf() - start!.valueOf()
  const hours = roundToHalf((duration / (1000 * 60 * 60)) % 24)

  if (Object.keys(extendedProps).length === 0)
    return (
      <>
        <Stack align='center'>
          <Heading
            fontSize={'sm'}
            fontWeight={500}
            fontFamily={'body'}
            color={'primary'}
            wordBreak='break-word'
          >
            {`${toFormattedDate(start!, 'HH:mm')} - ${toFormattedDate(end!, 'HH:mm')}`}
          </Heading>
        </Stack>

        {hours > 1.5 && (
          <Stack align='center'>
            <Avatar
              size={'sm'}
              src={`https://avatars.dicebear.com/api/adventurer-neutral/${currentUser.id}.svg`}
              border={`2px solid ${roleColors[Role.BasicUser]}`}
            />
            <Heading
              fontSize={'sm'}
              fontWeight={500}
              fontFamily={'body'}
              color={'primary'}
              wordBreak='break-word'
            >
              {currentUser.email}
            </Heading>
          </Stack>
        )}
      </>
    )

  return (
    <>
      <Stack align='center'>
        <Heading
          fontSize={'sm'}
          fontWeight={500}
          fontFamily={'body'}
          color={'primary'}
          wordBreak='break-word'
        >
          {`${toFormattedDate(start!, 'HH:mm')} - ${toFormattedDate(end!, 'HH:mm')}`}
        </Heading>
      </Stack>

      {hours > 1 && (
        <Stack align='center'>
          <Avatar
            size={'sm'}
            src={`https://avatars.dicebear.com/api/adventurer-neutral/${
              extendedProps!.customer
            }.svg`}
            border={`2px solid ${roleColors[Role.BasicUser]}`}
          />
        </Stack>
      )}

      {hours > 1 && (
        <Stack align='center'>
          <Heading
            fontSize={'sm'}
            fontWeight={500}
            fontFamily={'body'}
            color={'primary'}
            wordBreak='break-word'
          >
            {title}
          </Heading>
        </Stack>
      )}

      {hours > 2 && (
        <Stack spacing={0} align={'center'}>
          <Text fontWeight={600} color={'tertiary'}>
            Court
          </Text>
          <Text color={'tertiary'} wordBreak='break-word'>
            {extendedProps!.court}
          </Text>
        </Stack>
      )}

      {hours > 3 && extendedProps!.trainer && (
        <Stack spacing={0} align={'center'}>
          <Text fontWeight={600} color={'tertiary'}>
            Trainer
          </Text>
          <Text color={'tertiary'} wordBreak='break-word'>
            {extendedProps!.trainer}
          </Text>
        </Stack>
      )}
    </>
  )
}

export default ReservationItem
