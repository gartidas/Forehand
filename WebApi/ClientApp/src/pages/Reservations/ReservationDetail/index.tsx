import {
  Box,
  Button,
  Divider,
  Flex,
  FormLabel,
  Heading,
  Spinner,
  Stack,
  Text
} from '@chakra-ui/react'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router'
import { IApiError } from '../../../api/types'
import CourtItem from '../../../components/elements/CourtItem'
import FetchError from '../../../components/elements/FetchError'
import { NAVBAR_HEIGHT } from '../../../components/modules/Navbar/Navbar'
import { IReservation } from '../../../domainTypes'
import { formatDateForForm, toLocalTime } from '../../../utils'
import api from '../../../api/httpClient'
import { ChevronLeftIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { roundToHalf } from '../utils'
import SportsGearItem from '../../../components/elements/SportsGearItem'
import TrainerItem from '../CreateReservation/TrainerItem'
import { WobblyDiv } from '../../../components/modules/WobblyDiv/WobblyDiv'
import { apiErrorToast, successToast } from '../../../services/toastService'

const ReservationDetail = () => {
  const navigate = useNavigate()
  const { reservationId } = useParams()

  const { data, isLoading, error } = useQuery<IReservation, IApiError>(
    ['reservations', reservationId],
    async () => (await api.get(`/reservations/${reservationId}`)).data
  )

  const deleteReservation = async () => {
    try {
      await api.delete(`/reservations/${reservationId}`)
      successToast('Reservation deleted.')
      navigate('/reservations')
    } catch (err) {
      apiErrorToast(err as IApiError)
    }
  }

  if (error) return <FetchError error={error} />
  if (isLoading || !data) return <Spinner thickness='4px' color='primary' size='xl' mt='30px' />

  const date = formatDateForForm(data.startDate)
  const fromTime = toLocalTime(data.startDate, 'HH:mm')
  const toTime = toLocalTime(data.endDate, 'HH:mm')
  const duration = new Date(data.endDate).valueOf() - new Date(data.startDate).valueOf()
  const hours = roundToHalf((duration / (1000 * 60 * 60)) % 24)
  const sportsGearSum =
    data.sportsGear.length > 0
      ? data.sportsGear.reduce((sum, current) => sum + current.reservationPrice * hours, 0)
      : 0
  const trainerSum = data.trainer ? data.trainer.reservationPrice! * hours : 0
  const courtSum = data.court ? data.court.reservationPrice * hours : 0
  const totalSum = courtSum + trainerSum + sportsGearSum

  return (
    <Box
      height={`calc(100vh - (${NAVBAR_HEIGHT} + 40px))`}
      bg={'bg'}
      rounded={'lg'}
      boxShadow={'lg'}
      overflowY='auto'
      mt={2}
    >
      <Stack spacing={2} alignItems='center'>
        <Flex alignItems='center' width='full' backgroundColor='bg2'>
          <WobblyDiv marginRight={3} marginLeft={3}>
            <Button variant='secondary' onClick={() => {}}>
              <EditIcon />
            </Button>
          </WobblyDiv>
          <WobblyDiv>
            <Button variant='warning' onClick={deleteReservation}>
              <DeleteIcon />
            </Button>
          </WobblyDiv>
          <Stack alignItems='center' width='full' py={2}>
            <Heading
              fontSize={{ base: 'sm', md: 'lg' }}
              fontWeight={500}
              fontFamily={'body'}
              color={'primary'}
            >
              {date}
            </Heading>
            <Heading
              fontSize={{ base: 'sm', md: 'lg' }}
              fontWeight={500}
              fontFamily={'body'}
              color={'primary'}
            >
              {fromTime}-{toTime}
            </Heading>
          </Stack>
          <Button variant='primary' onClick={() => navigate('/reservations')} marginRight={5}>
            <ChevronLeftIcon />
          </Button>
        </Flex>

        <Stack width='full' p={2}>
          <Box>
            <FormLabel m={0}>Court</FormLabel>

            <CourtItem court={data.court} />

            <Flex justifyContent='flex-end' marginTop={5}>
              <Stack spacing={0} align={'center'}>
                <Text fontSize={'sm'} color={'tertiary'}>
                  Subtotal:
                </Text>
                <Text
                  fontWeight={600}
                >{`${data.court.reservationPrice} x ${hours}= ${courtSum} €`}</Text>
              </Stack>
            </Flex>
          </Box>

          {data.trainer && (
            <Box>
              <Divider marginTop={5} marginBottom={10} />

              <FormLabel m={0}>Trainer</FormLabel>

              <TrainerItem
                trainer={data.trainer}
                onClick={() => navigate(`/users/${data.trainer.id}`)}
              />

              <Flex justifyContent='flex-end' marginTop={5}>
                <Stack spacing={0} align={'center'}>
                  <Text fontSize={'sm'} color={'tertiary'}>
                    Subtotal:
                  </Text>
                  <Text
                    fontWeight={600}
                  >{`${data.trainer.reservationPrice} x ${hours}= ${trainerSum} €`}</Text>
                </Stack>
              </Flex>
            </Box>
          )}

          {data.sportsGear.length > 0 && (
            <Box>
              <Divider marginTop={5} marginBottom={10} />

              <FormLabel m={0}>Sports gear</FormLabel>

              {data.sportsGear.map(sportsGearItem => (
                <SportsGearItem sportsGear={sportsGearItem} />
              ))}

              <Flex justifyContent='flex-end'>
                <Stack spacing={0} marginTop={5}>
                  <Text fontSize={'sm'} color={'tertiary'} alignSelf={'center'}>
                    Subtotal:
                  </Text>
                  <Text fontWeight={600} alignSelf={'flex-end'}>{`${
                    data.sportsGear[0].reservationPrice
                  } x ${hours}= ${data.sportsGear[0].reservationPrice! * hours} €`}</Text>
                  {data.sportsGear.slice(1).map(subItem => (
                    <Text fontWeight={600} alignSelf={'flex-end'}>{`+ ${
                      subItem.reservationPrice
                    } x ${hours}= ${subItem.reservationPrice! * hours} €`}</Text>
                  ))}
                  {data.sportsGear.length > 1 && (
                    <>
                      <Divider marginTop={5} marginBottom={10} borderColor='primary' />

                      <Text fontWeight={600} alignSelf={'flex-end'}>
                        {`${sportsGearSum} €`}
                      </Text>
                    </>
                  )}
                </Stack>
              </Flex>
            </Box>
          )}

          {totalSum > 0 && (
            <Stack width='full'>
              <Box>
                <Divider marginTop={5} marginBottom={5} />
              </Box>
              <Stack alignSelf='flex-end' paddingRight={5} paddingBottom={5}>
                <Heading
                  fontSize={{ base: 'sm', md: 'lg' }}
                  fontWeight={500}
                  fontFamily={'body'}
                  color={'primary'}
                  alignSelf='center'
                >
                  Total:
                </Heading>
                <Heading
                  fontSize={{ base: 'sm', md: 'lg' }}
                  fontWeight={500}
                  fontFamily={'body'}
                  color={'primary'}
                  alignSelf='flex-end'
                >
                  {`${totalSum} €`}
                </Heading>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Box>
  )
}

export default ReservationDetail
