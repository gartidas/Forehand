import { CloseIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Divider,
  Flex,
  FormLabel,
  Heading,
  Icon,
  Spinner,
  Stack,
  Text,
  useRadioGroup
} from '@chakra-ui/react'
import { useMemo, useState } from 'react'
import { IApiError } from '../../api/types'
import { NAVBAR_HEIGHT } from '../../components/modules/Navbar/Navbar'
import { useOrders } from '../../contextProviders/OrdersProvider'
import {
  IGiftCard,
  ISubscriptionCard,
  OrderItemType,
  OrderState,
  PaymentMethod,
  Role
} from '../../domainTypes'
import { apiErrorToast, successToast } from '../../services/toastService'
import ReservationItem from './OrderItems/ReservationItem'
import api from '../../api/httpClient'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import Form from '../../components/modules/HookForm/Form'
import { useSubmitForm } from '../../components/modules/HookForm/hooks/useSubmitForm'
import CartIcon from '../../components/elements/CartIcon'
import PaymentMethodRadio from '../../components/elements/PaymentMethodRadio'
import { BsCash, BsCreditCard2Back, BsCreditCard2BackFill } from 'react-icons/bs'
import ConsumerGoodsItem from './OrderItems/ConsumerGoodsItem'
import GiftCardItem from './OrderItems/GiftCardItem'
import { useAuthorizedUser } from '../../contextProviders/AuthProvider'
import { useQuery } from 'react-query'
import FetchError from '../../components/elements/FetchError'
import FormAutoCompleteInput from '../../components/elements/FormAutoCompleteInput'
import { AutoCompleteItem, AutoCompleteList } from '@choc-ui/chakra-autocomplete'
import SubscriptionCardItem from './OrderItems/SubscriptionCardItem'

interface IFormValue {
  paymentMethod: PaymentMethod
  orderState: OrderState
  totalSum: number
  subscriptionCard: ISubscriptionCard
  giftCardIds: string[]
  consumerGoodsIds: string[]
  reservationIds: string[]
}

const defaultValues: Partial<IFormValue> = {
  paymentMethod: PaymentMethod.Unknown,
  orderState: OrderState.Unknown,
  totalSum: 0,
  subscriptionCard: undefined,
  giftCardIds: [],
  consumerGoodsIds: [],
  reservationIds: []
}

const Cart = () => {
  const [usableGiftCard, setUsableGiftCard] = useState<IGiftCard>()
  const { currentUser } = useAuthorizedUser()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.Cash)
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'paymentMethod',
    defaultValue: PaymentMethod[paymentMethod],
    onChange: value => setPaymentMethod(PaymentMethod[value as keyof typeof PaymentMethod])
  })
  const {
    reservations,
    consumerGoods,
    giftCards,
    subscriptionCard,
    orderItemsCount,
    removeOrderItem,
    clearCart
  } = useOrders()
  const reservationsSum = useMemo(
    () =>
      reservations && reservations.length > 0
        ? reservations.reduce((sum, current) => sum + current.price, 0)
        : 0,
    [reservations]
  )
  const consumerGoodsSum = useMemo(
    () =>
      consumerGoods && consumerGoods.length > 0
        ? consumerGoods.reduce((sum, current) => sum + current.price, 0)
        : 0,
    [consumerGoods]
  )
  const giftCardsSum = useMemo(
    () =>
      giftCards && giftCards.length > 0
        ? giftCards.reduce((sum, current) => sum + current.price, 0)
        : 0,
    [giftCards]
  )
  const giftCardReduction = useMemo(
    () =>
      (consumerGoods === undefined || consumerGoods.length === 0) &&
      subscriptionCard === null &&
      currentUser.subscriptionCard === undefined &&
      usableGiftCard
        ? usableGiftCard.price
        : 0,
    [usableGiftCard, consumerGoods, subscriptionCard, currentUser]
  )

  const subCardReduction =
    (consumerGoods === undefined || consumerGoods.length === 0) &&
    (giftCards === undefined || giftCards.length === 0) &&
    subscriptionCard === null &&
    usableGiftCard === undefined &&
    currentUser.subscriptionCard !== undefined
      ? 0
      : 1

  const totalSum = useMemo(() => {
    const total =
      reservationsSum +
      consumerGoodsSum +
      giftCardsSum -
      giftCardReduction +
      (subscriptionCard ? subscriptionCard.price : 0)
    const totalWithZero = total > 0 ? total : 0
    return totalWithZero * subCardReduction
  }, [
    reservationsSum,
    consumerGoodsSum,
    giftCardsSum,
    giftCardReduction,
    subscriptionCard,
    subCardReduction
  ])

  const deleteReservation = async (reservationId: string) => {
    try {
      await api.delete(`/reservations/${reservationId}`)
      removeOrderItem(reservationId!, OrderItemType.Reservation)
      successToast('Reservation removed.')
    } catch (err) {
      apiErrorToast(err as IApiError)
    }
  }

  const deleteConsumerGoods = async (consumerGoodsId: string) => {
    removeOrderItem(consumerGoodsId!, OrderItemType.ConsumerGoods)
    successToast('Product removed.')
  }

  const deleteGiftCard = async (giftCardId: string) => {
    removeOrderItem(giftCardId!, OrderItemType.GiftCard)
    successToast('Gift card removed.')
  }

  const deleteSubscriptionCard = async (subscriptionCardId: string) => {
    removeOrderItem(subscriptionCardId!, OrderItemType.SubscriptionCard)
    successToast('Subscription card removed.')
  }

  const { data, isLoading, error } = useQuery<IGiftCard[], IApiError>(
    ['cart', 'gift-cards', 'customer', currentUser.id],
    async () => (await api.get(`/gift-cards/customer/${currentUser.id}`)).data,
    { enabled: currentUser.role === Role.BasicUser }
  )

  const applyGiftCard = async (giftCardId: string) => {
    try {
      await api.delete(`/gift-cards/${giftCardId}/use`)
    } catch (err) {
      apiErrorToast(err as IApiError)
    }
  }

  const { submitting, onSubmit } = useSubmitForm<IFormValue, string>({
    url: '/orders',
    formatter: values => ({
      ...values,
      paymentMethod: paymentMethod,
      orderState: OrderState.Fulfilled,
      totalSum: totalSum,
      subscriptionCard: subscriptionCard,
      giftCardIds: giftCards ? giftCards.map(x => x.id) : [],
      consumerGoodsIds: consumerGoods ? consumerGoods.map(x => x.id) : [],
      reservationIds: reservations ? reservations.map(x => x.id) : []
    }),
    successCallback: data => {
      if (usableGiftCard) {
        applyGiftCard(usableGiftCard.id)
        setUsableGiftCard(undefined)
      }
      clearCart(false)
      successToast('Order created successfully.')
    },
    errorCallback: error => apiErrorToast({ data: error, status: 400 })
  })

  if (currentUser.role === Role.BasicUser && error) return <FetchError error={error} />
  if (currentUser.role === Role.BasicUser && (isLoading || !data))
    return <Spinner thickness='4px' color='primary' size='xl' mt='30px' />

  return (
    <Stack
      height={`calc(100vh - (${NAVBAR_HEIGHT} + 40px))`}
      bg={'bg'}
      rounded={'lg'}
      boxShadow={'lg'}
      overflowY='auto'
      mt={2}
      spacing={2}
      alignItems='center'
    >
      <Stack width='full' px={5}>
        <Form onSubmit={onSubmit} defaultValues={defaultValues}>
          {reservations && reservations.length > 0 && (
            <Box width='full'>
              <FormLabel m={0}>Reservations</FormLabel>

              {reservations.map(x => (
                <ReservationItem
                  key={x.id}
                  reservation={x}
                  button={{
                    name: '',
                    icon: <CloseIcon />,
                    variant: 'warning',
                    onClick: () => deleteReservation(x.id)
                  }}
                ></ReservationItem>
              ))}

              <Flex justifyContent='flex-end'>
                <Stack spacing={0} marginTop={5}>
                  <Text fontSize={'sm'} color={'tertiary'} alignSelf={'center'}>
                    Subtotal:
                  </Text>
                  <Text
                    fontWeight={600}
                    alignSelf={'flex-end'}
                  >{`${reservations[0].price} €`}</Text>
                  {reservations.slice(1).map(subItem => (
                    <Text
                      key={subItem.id}
                      fontWeight={600}
                      alignSelf={'flex-end'}
                    >{`+ ${subItem.price} €`}</Text>
                  ))}
                  {reservations.length > 1 && (
                    <>
                      <Divider marginTop={5} marginBottom={10} borderColor='primary' />

                      <Text fontWeight={600} alignSelf={'flex-end'}>
                        {`${reservationsSum} €`}
                      </Text>
                    </>
                  )}
                </Stack>
              </Flex>

              <Divider marginTop={5} marginBottom={10} />
            </Box>
          )}

          {consumerGoods && consumerGoods.length > 0 && (
            <Box width='full'>
              <FormLabel m={0}>Consumer goods</FormLabel>

              {consumerGoods.map(x => (
                <ConsumerGoodsItem
                  key={x.id}
                  consumerGoods={x}
                  button={{
                    name: '',
                    icon: <CloseIcon />,
                    variant: 'warning',
                    onClick: () => deleteConsumerGoods(x.id)
                  }}
                ></ConsumerGoodsItem>
              ))}

              <Flex justifyContent='flex-end'>
                <Stack spacing={0} marginTop={5}>
                  <Text fontSize={'sm'} color={'tertiary'} alignSelf={'center'}>
                    Subtotal:
                  </Text>
                  <Text
                    fontWeight={600}
                    alignSelf={'flex-end'}
                  >{`${consumerGoods[0].price} €`}</Text>
                  {consumerGoods.slice(1).map(subItem => (
                    <Text
                      key={subItem.id}
                      fontWeight={600}
                      alignSelf={'flex-end'}
                    >{`+ ${subItem.price} €`}</Text>
                  ))}
                  {consumerGoods.length > 1 && (
                    <>
                      <Divider marginTop={5} marginBottom={10} borderColor='primary' />

                      <Text fontWeight={600} alignSelf={'flex-end'}>
                        {`${consumerGoodsSum} €`}
                      </Text>
                    </>
                  )}
                </Stack>
              </Flex>

              <Divider marginTop={5} marginBottom={10} />
            </Box>
          )}

          {currentUser.role === Role.BasicUser && giftCards && giftCards.length > 0 ? (
            <Box width='full'>
              <FormLabel m={0}>Gift cards</FormLabel>

              {giftCards.map(x => (
                <GiftCardItem
                  key={x.id}
                  giftCard={x}
                  button={{
                    name: '',
                    icon: <CloseIcon />,
                    variant: 'warning',
                    onClick: () => deleteGiftCard(x.id)
                  }}
                ></GiftCardItem>
              ))}

              <Flex justifyContent='flex-end'>
                <Stack spacing={0} marginTop={5}>
                  <Text fontSize={'sm'} color={'tertiary'} alignSelf={'center'}>
                    Subtotal:
                  </Text>
                  <Text fontWeight={600} alignSelf={'flex-end'}>{`${giftCards[0].price} €`}</Text>
                  {giftCards.slice(1).map(subItem => (
                    <Text
                      key={subItem.id}
                      fontWeight={600}
                      alignSelf={'flex-end'}
                    >{`+ ${subItem.price} €`}</Text>
                  ))}
                  {giftCards.length > 1 && (
                    <>
                      <Divider marginTop={5} marginBottom={10} borderColor='primary' />

                      <Text fontWeight={600} alignSelf={'flex-end'}>
                        {`${giftCardsSum} €`}
                      </Text>
                    </>
                  )}
                </Stack>
              </Flex>

              <Divider marginTop={5} marginBottom={10} />
            </Box>
          ) : (
            <>
              {orderItemsCount > 0 &&
                (consumerGoods === undefined || consumerGoods.length === 0) &&
                subscriptionCard === null &&
                currentUser.subscriptionCard === undefined && (
                  <Box width='full'>
                    {usableGiftCard ? (
                      <>
                        <FormLabel m={0}>Gift card</FormLabel>
                        <GiftCardItem
                          giftCard={usableGiftCard}
                          button={{
                            name: '',
                            icon: <CloseIcon />,
                            variant: 'warning',
                            onClick: () => setUsableGiftCard(undefined)
                          }}
                        />

                        <Flex justifyContent='flex-end' marginTop={5}>
                          <Stack spacing={0} align={'center'}>
                            <Text fontSize={'sm'} color={'tertiary'}>
                              Subtotal:
                            </Text>
                            <Text fontWeight={600}>{`- ${usableGiftCard.price} €`}</Text>
                          </Stack>
                        </Flex>
                      </>
                    ) : (
                      <FormAutoCompleteInput name='giftCard' label='Gift card' width='full'>
                        <AutoCompleteList>
                          {data!.map(x => (
                            <AutoCompleteItem
                              key={`option-${x.id}`}
                              value={x.id}
                              align='center'
                              onClick={() => setUsableGiftCard(x)}
                            >
                              <GiftCardItem giftCard={x} />
                            </AutoCompleteItem>
                          ))}
                        </AutoCompleteList>
                      </FormAutoCompleteInput>
                    )}

                    <Divider marginTop={5} marginBottom={10} />
                  </Box>
                )}
            </>
          )}

          {orderItemsCount > 0 &&
            (consumerGoods === undefined || consumerGoods.length === 0) &&
            (giftCards === undefined || giftCards.length === 0) &&
            subscriptionCard === null &&
            usableGiftCard === undefined &&
            currentUser.subscriptionCard !== undefined && (
              <Box width='full'>
                <FormLabel m={0}>Subscription card</FormLabel>

                <SubscriptionCardItem
                  subscriptionCard={currentUser.subscriptionCard}
                ></SubscriptionCardItem>

                <Divider marginTop={5} marginBottom={10} />
              </Box>
            )}

          {subscriptionCard && (
            <Box width='full'>
              <FormLabel m={0}>Subscription card</FormLabel>

              <SubscriptionCardItem
                subscriptionCard={subscriptionCard}
                button={{
                  name: '',
                  icon: <CloseIcon />,
                  variant: 'warning',
                  onClick: () => deleteSubscriptionCard(subscriptionCard.id)
                }}
              ></SubscriptionCardItem>

              <Flex justifyContent='flex-end'>
                <Stack spacing={0} marginTop={5}>
                  <Text fontSize={'sm'} color={'tertiary'} alignSelf={'center'}>
                    Subtotal:
                  </Text>
                  <Text
                    fontWeight={600}
                    alignSelf={'flex-end'}
                  >{`${subscriptionCard.price} €`}</Text>
                </Stack>
              </Flex>

              <Divider marginTop={5} marginBottom={10} />
            </Box>
          )}

          {orderItemsCount > 0 && (
            <>
              <Stack width='full' marginBottom={5}>
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

              {totalSum > 0 && (
                <Flex {...getRootProps()} width='full' justifyContent='space-around' marginTop={20}>
                  <PaymentMethodRadio
                    isDisabled={false}
                    key={PaymentMethod[PaymentMethod.Cash]}
                    {...getRadioProps({ value: PaymentMethod[PaymentMethod.Cash] })}
                  >
                    <Flex alignItems='center' justifyContent='center' height='100%'>
                      <Icon as={BsCash} />
                      <Text marginLeft={5} fontSize={{ base: 15, md: 20 }}>
                        Cash
                      </Text>
                    </Flex>
                  </PaymentMethodRadio>
                  <PaymentMethodRadio
                    isDisabled={false}
                    key={PaymentMethod[PaymentMethod.CreditCard]}
                    {...getRadioProps({ value: PaymentMethod[PaymentMethod.CreditCard] })}
                  >
                    <Flex alignItems='center' justifyContent='center' height='100%'>
                      <Icon as={BsCreditCard2Back} />
                      <Text marginLeft={5} fontSize={{ base: 15, md: 20 }}>
                        Credit card
                      </Text>
                    </Flex>
                  </PaymentMethodRadio>
                  <PaymentMethodRadio
                    isDisabled={false}
                    key={PaymentMethod[PaymentMethod.DebitCard]}
                    {...getRadioProps({ value: PaymentMethod[PaymentMethod.DebitCard] })}
                  >
                    <Flex alignItems='center' justifyContent='center' height='100%'>
                      <Icon as={BsCreditCard2BackFill} />
                      <Text marginLeft={5} fontSize={{ base: 15, md: 20 }}>
                        Debit card
                      </Text>
                    </Flex>
                  </PaymentMethodRadio>
                </Flex>
              )}

              <Flex width='full' justifyContent='flex-end' marginTop={20} marginBottom={10}>
                <Button variant='secondary' type='submit' isLoading={submitting}>
                  <Flex alignItems='center'>
                    <CartIcon />
                    <Text marginLeft={5}>Check out</Text>
                  </Flex>
                </Button>
              </Flex>
            </>
          )}
        </Form>
      </Stack>

      {orderItemsCount === 0 && (
        <Stack alignItems='center' justifyContent='center' height='full'>
          <Text fontWeight={600}>{'Cart is empty :('}</Text>
          <Icon as={AiOutlineShoppingCart} height={10} width={10} />
        </Stack>
      )}
    </Stack>
  )
}

export default Cart
