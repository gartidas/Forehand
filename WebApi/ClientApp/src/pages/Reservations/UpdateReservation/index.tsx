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
import { AutoCompleteItem, AutoCompleteList } from '@choc-ui/chakra-autocomplete'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router'
import { IApiError } from '../../../api/types'
import CourtItem from '../../../components/elements/CourtItem'
import FetchError from '../../../components/elements/FetchError'
import FormAutoCompleteInput from '../../../components/elements/FormAutoCompleteInput'
import { NAVBAR_HEIGHT } from '../../../components/modules/Navbar/Navbar'
import {
  ICourt,
  IReservation,
  ISportsGear,
  IUserExtended,
  ReservationState
} from '../../../domainTypes'
import { formatDateForForm, toFormattedDate } from '../../../utils'
import { requiredValidator } from '../../../utils/validators'
import api from '../../../api/httpClient'
import { useSubmitForm } from '../../../components/modules/HookForm/hooks/useSubmitForm'
import { apiErrorToast, successToast } from '../../../services/toastService'
import Form from '../../../components/modules/HookForm/Form'
import { useMemo, useState } from 'react'
import RequiredIndicator from '../../../components/elements/RequiredIndicator'
import { ChevronLeftIcon, CloseIcon } from '@chakra-ui/icons'
import TrainerItem from '../ReservationItems/TrainerItem'
import { roundToHalf } from '../utils'
import SportsGearItem from '../../../components/elements/SportsGearItem'

interface IFormValue {
  price: number
  startDate: string
  endDate: string
  reservationState: ReservationState
  courtId: string
  trainerId: string
  customerId: string
  sportsGearIds: string[]
}

const UpdateReservation = () => {
  const { reservationId } = useParams()
  const navigate = useNavigate()
  const [court, setCourt] = useState<ICourt>()
  const [trainer, setTrainer] = useState<IUserExtended>()
  const [sportsGear, setSportsGear] = useState<ISportsGear[]>([])
  const [dropDownSportsGear, setDropDownSportsGear] = useState<ISportsGear[]>([])

  const { data, isLoading, error } = useQuery<IReservation, IApiError>(
    ['reservations', reservationId],
    async () => (await api.get(`/reservations/${reservationId}`)).data,
    {
      onSuccess: response => {
        setCourt(response.court)
        setTrainer(response.trainer)
        setSportsGear(response.sportsGear)
      }
    }
  )

  const date = data ? formatDateForForm(data.startDate) : ''
  const fromTime = data ? toFormattedDate(data.startDate, 'HH:mm') : ''
  const toTime = data ? toFormattedDate(data.endDate, 'HH:mm') : ''
  const duration = data ? new Date(data.endDate).valueOf() - new Date(data.startDate).valueOf() : 0
  const hours = roundToHalf((duration / (1000 * 60 * 60)) % 24)
  const sportsGearSum = useMemo(
    () =>
      sportsGear.length > 0
        ? sportsGear.reduce((sum, current) => sum + current.reservationPrice * hours, 0)
        : 0,
    [sportsGear, hours]
  )
  const trainerSum = useMemo(
    () => (trainer ? trainer.reservationPrice! * hours : 0),
    [trainer, hours]
  )
  const courtSum = useMemo(() => (court ? court.reservationPrice * hours : 0), [court, hours])
  const totalSum = useMemo(
    () => courtSum + trainerSum + sportsGearSum,
    [courtSum, trainerSum, sportsGearSum]
  )

  const { submitting, onSubmit } = useSubmitForm<IFormValue, string>({
    url: `/reservations/${data!.id}`,
    method: 'patch',
    formatter: values => ({
      ...values,
      courtId: court!.id,
      trainerId: trainer && trainer.id,
      sportsGearIds: sportsGear.map(x => x.id),
      price: totalSum,
      startDate: toFormattedDate(data!.startDate, 'yyyy-MM-DDTHH:mm:ss'),
      endDate: toFormattedDate(data!.endDate, 'yyyy-MM-DDTHH:mm:ss'),
      reservationState: ReservationState.Planned
    }),
    successCallback: () => {
      successToast('Reservation updated successfully.')
      navigate(`/reservations/${data!.id}`)
    },
    errorCallback: error => apiErrorToast({ data: error, status: 400 })
  })

  const courtsQuery = useQuery<ICourt[], IApiError>(
    ['reservations', 'items', 'courts'],
    async () =>
      (
        await api.post(`/reservations/items/courts`, {
          fromDate: toFormattedDate(data!.startDate, 'yyyy-MM-DDTHH:mm:ss'),
          toDate: toFormattedDate(data!.endDate, 'yyyy-MM-DDTHH:mm:ss')
        })
      ).data,
    { enabled: !!data }
  )
  const trainersQuery = useQuery<IUserExtended[], IApiError>(
    ['reservations', 'items', 'trainers'],
    async () =>
      (
        await api.post(`/reservations/items/trainers`, {
          fromDate: toFormattedDate(data!.startDate, 'yyyy-MM-DDTHH:mm:ss'),
          toDate: toFormattedDate(data!.endDate, 'yyyy-MM-DDTHH:mm:ss')
        })
      ).data,
    { enabled: !!data }
  )
  const sportsGearQuery = useQuery<ISportsGear[], IApiError>(
    ['reservations', 'items', 'sportsGear'],
    async () =>
      (
        await api.post(`/reservations/items/sportsGear`, {
          fromDate: toFormattedDate(data!.startDate, 'yyyy-MM-DDTHH:mm:ss'),
          toDate: toFormattedDate(data!.endDate, 'yyyy-MM-DDTHH:mm:ss')
        })
      ).data,
    { onSuccess: response => setDropDownSportsGear(response), enabled: !!data }
  )

  if (error) return <FetchError error={error} />
  if (isLoading || !data) return <Spinner thickness='4px' color='primary' size='xl' mt='30px' />

  if (courtsQuery.error) return <FetchError error={courtsQuery.error} />
  if (trainersQuery.error) return <FetchError error={trainersQuery.error} />
  if (sportsGearQuery.error) return <FetchError error={sportsGearQuery.error} />
  if (
    courtsQuery.isLoading ||
    !courtsQuery.data ||
    trainersQuery.isLoading ||
    !trainersQuery.data ||
    sportsGearQuery.isLoading ||
    !sportsGearQuery.data
  )
    return <Spinner thickness='4px' color='primary' size='xl' mt='30px' />

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
          <Stack alignItems='center' py={2} width='full'>
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
          <Button
            variant='primary'
            onClick={() => navigate(`/reservations/${data.id}`)}
            marginRight={5}
          >
            <ChevronLeftIcon />
          </Button>
        </Flex>

        <Stack width='full' p={2}>
          <Form onSubmit={onSubmit} defaultValues={data}>
            {court ? (
              <>
                <Flex mb={1}>
                  <FormLabel m={0}>Court</FormLabel>
                  <RequiredIndicator />
                </Flex>

                <CourtItem
                  court={court}
                  button={{
                    name: '',
                    icon: <CloseIcon />,
                    variant: 'warning',
                    onClick: () => setCourt(undefined)
                  }}
                />

                <Flex justifyContent='flex-end' marginTop={5}>
                  <Stack spacing={0} align={'center'}>
                    <Text fontSize={'sm'} color={'tertiary'}>
                      Subtotal:
                    </Text>
                    <Text
                      fontWeight={600}
                    >{`${court.reservationPrice} x ${hours}= ${courtSum} €`}</Text>
                  </Stack>
                </Flex>
              </>
            ) : (
              <FormAutoCompleteInput
                name='courtId'
                label='Court'
                isRequired
                validate={requiredValidator}
                width='full'
              >
                <AutoCompleteList>
                  {courtsQuery.data.map(court => (
                    <AutoCompleteItem
                      key={`option-${court.id}`}
                      value={court.id}
                      align='center'
                      onClick={() => setCourt(court)}
                    >
                      <CourtItem court={court} />
                    </AutoCompleteItem>
                  ))}
                </AutoCompleteList>
              </FormAutoCompleteInput>
            )}

            <Divider marginTop={5} marginBottom={10} />

            {trainer ? (
              <>
                <FormLabel m={0}>Trainer</FormLabel>

                <TrainerItem
                  trainer={trainer}
                  onClick={() => navigate(`/users/${trainer.id}`)}
                  button={{
                    name: '',
                    icon: <CloseIcon />,
                    variant: 'warning',
                    onClick: () => setTrainer(undefined)
                  }}
                />

                <Flex justifyContent='flex-end' marginTop={5}>
                  <Stack spacing={0} align={'center'}>
                    <Text fontSize={'sm'} color={'tertiary'}>
                      Subtotal:
                    </Text>
                    <Text
                      fontWeight={600}
                    >{`${trainer.reservationPrice} x ${hours}= ${trainerSum} €`}</Text>
                  </Stack>
                </Flex>
              </>
            ) : (
              <FormAutoCompleteInput name='trainerId' label='Trainer' width='full'>
                <AutoCompleteList>
                  {trainersQuery.data.map(trainer => (
                    <AutoCompleteItem
                      key={`option-${trainer.id}`}
                      value={trainer.id}
                      align='center'
                      onClick={() => setTrainer(trainer)}
                    >
                      <TrainerItem
                        trainer={trainer}
                        onClick={() => navigate(`/users/${trainer.id}`)}
                      />
                    </AutoCompleteItem>
                  ))}
                </AutoCompleteList>
              </FormAutoCompleteInput>
            )}

            <Divider marginTop={5} marginBottom={10} />

            <FormAutoCompleteInput
              key={dropDownSportsGear.length}
              name='sportsGearIds'
              label='Sports gear'
              width='full'
            >
              <AutoCompleteList width='full'>
                {dropDownSportsGear.map(dropDownSportsGearItem => (
                  <AutoCompleteItem
                    key={`option-${dropDownSportsGearItem.id}`}
                    value={dropDownSportsGearItem.id}
                    align='center'
                    onClick={() => {
                      setDropDownSportsGear(prev =>
                        prev.filter(x => x.id !== dropDownSportsGearItem.id)
                      )
                      setSportsGear(prev => [...prev, dropDownSportsGearItem])
                    }}
                  >
                    <SportsGearItem sportsGear={dropDownSportsGearItem} />
                  </AutoCompleteItem>
                ))}
              </AutoCompleteList>
            </FormAutoCompleteInput>

            {sportsGear.length > 0 && (
              <>
                {sportsGear.map(sportsGearItem => (
                  <SportsGearItem
                    sportsGear={sportsGearItem}
                    button={{
                      name: '',
                      icon: <CloseIcon />,
                      variant: 'warning',
                      onClick: () => {
                        setDropDownSportsGear(prev => [...prev, sportsGearItem])
                        setSportsGear(prev => prev.filter(y => y.id !== sportsGearItem.id))
                      }
                    }}
                  />
                ))}

                <Flex justifyContent='flex-end'>
                  <Stack spacing={0} marginTop={5}>
                    <Text fontSize={'sm'} color={'tertiary'} alignSelf={'center'}>
                      Subtotal:
                    </Text>
                    <Text fontWeight={600} alignSelf={'flex-end'}>{`${
                      sportsGear[0].reservationPrice
                    } x ${hours}= ${sportsGear[0].reservationPrice! * hours} €`}</Text>
                    {sportsGear.slice(1).map(subItem => (
                      <Text fontWeight={600} alignSelf={'flex-end'}>{`+ ${
                        subItem.reservationPrice
                      } x ${hours}= ${subItem.reservationPrice! * hours} €`}</Text>
                    ))}
                    {sportsGear.length > 1 && (
                      <>
                        <Divider marginTop={5} marginBottom={10} borderColor='primary' />

                        <Text fontWeight={600} alignSelf={'flex-end'}>
                          {`${sportsGearSum} €`}
                        </Text>
                      </>
                    )}
                  </Stack>
                </Flex>
              </>
            )}

            {totalSum > 0 && (
              <Stack width='full' marginBottom={5}>
                <Divider marginTop={5} marginBottom={5} />
                <Stack alignSelf='flex-end' paddingRight={5}>
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

            <Flex width='full' justifyContent='flex-end' marginTop={5}>
              <Button
                variant='secondary'
                type='submit'
                disabled={court ? false : true}
                isLoading={submitting}
              >
                Submit
              </Button>
            </Flex>
          </Form>
        </Stack>
      </Stack>
    </Box>
  )
}

export default UpdateReservation
