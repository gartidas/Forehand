import { CloseIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Divider,
  Flex,
  FormLabel,
  Heading,
  Icon,
  Stack,
  Text,
  useRadioGroup
} from '@chakra-ui/react'
import { useMemo, useState } from 'react'
import { IApiError } from '../../api/types'
import { NAVBAR_HEIGHT } from '../../components/modules/Navbar/Navbar'
import { useOrders } from '../../contextProviders/OrdersProvider'
import { IOrder, OrderItemType, OrderState, PaymentMethod } from '../../domainTypes'
import { apiErrorToast, successToast } from '../../services/toastService'
import ReservationItem from './OrderItems/ReservationItem'
import api from '../../api/httpClient'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import Form from '../../components/modules/HookForm/Form'
import { useSubmitForm } from '../../components/modules/HookForm/hooks/useSubmitForm'
import CartIcon from '../../components/elements/CartIcon'
import PaymentMethodRadio from '../../components/elements/PaymentMethodRadio'
import { BsCash, BsCreditCard2Back, BsCreditCard2BackFill } from 'react-icons/bs'

interface IFormValue {
  paymentMethod: PaymentMethod
  orderState: OrderState
  totalSum: number
  giftCardIds: string[]
  consumerGoodsIds: string[]
  reservationIds: string[]
}

const defaultValues: Partial<IFormValue> = {
  paymentMethod: PaymentMethod.Unknown,
  orderState: OrderState.Unknown,
  totalSum: 0,
  giftCardIds: [],
  consumerGoodsIds: [],
  reservationIds: []
}

const Cart = () => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.Cash)
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'paymentMethod',
    defaultValue: PaymentMethod[paymentMethod],
    onChange: value => setPaymentMethod(PaymentMethod[value as keyof typeof PaymentMethod])
  })
  const { reservations, orderItemsCount, removeOrderItem, clearCart } = useOrders()
  const reservationsSum = useMemo(
    () =>
      reservations && reservations.length > 0
        ? reservations.reduce((sum, current) => sum + current.price, 0)
        : 0,
    [reservations]
  )
  const totalSum = useMemo(() => reservationsSum, [reservationsSum])

  const deleteReservation = async (reservationId: string) => {
    try {
      await api.delete(`/reservations/${reservationId}`)
      removeOrderItem(reservationId!, OrderItemType.Reservation)
      successToast('Reservation deleted.')
    } catch (err) {
      apiErrorToast(err as IApiError)
    }
  }

  const { submitting, onSubmit } = useSubmitForm<IFormValue, IOrder>({
    url: '/orders',
    formatter: values => ({
      ...values,
      paymentMethod: paymentMethod,
      orderState: OrderState.Fulfilled,
      totalSum: totalSum,
      giftCardIds: [],
      consumerGoodsIds: [],
      reservationIds: reservations ? reservations.map(x => x.id) : []
    }),
    successCallback: data => {
      clearCart()
      successToast('Order created successfully.')
    },
    errorCallback: error => apiErrorToast({ data: error, status: 400 })
  })

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
                    <Text fontWeight={600} alignSelf={'flex-end'}>{`+ ${subItem.price} €`}</Text>
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

          {totalSum > 0 && (
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

              <Flex {...getRootProps()} width='full' justifyContent='space-around' marginTop={20}>
                <PaymentMethodRadio
                  key={PaymentMethod[PaymentMethod.Cash]}
                  {...getRadioProps({ value: PaymentMethod[PaymentMethod.Cash] })}
                >
                  <Flex alignItems='center'>
                    <Icon as={BsCash} />
                    <Text marginLeft={5}>Cash</Text>
                  </Flex>
                </PaymentMethodRadio>
                <PaymentMethodRadio
                  key={PaymentMethod[PaymentMethod.CreditCard]}
                  {...getRadioProps({ value: PaymentMethod[PaymentMethod.CreditCard] })}
                >
                  <Flex alignItems='center'>
                    <Icon as={BsCreditCard2Back} />
                    <Text marginLeft={5}>Credit card</Text>
                  </Flex>
                </PaymentMethodRadio>
                <PaymentMethodRadio
                  key={PaymentMethod[PaymentMethod.DebitCard]}
                  {...getRadioProps({ value: PaymentMethod[PaymentMethod.DebitCard] })}
                >
                  <Flex alignItems='center'>
                    <Icon as={BsCreditCard2BackFill} />
                    <Text marginLeft={5}>Debit card</Text>
                  </Flex>
                </PaymentMethodRadio>
              </Flex>

              <Flex width='full' justifyContent='flex-end' marginTop={20}>
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
