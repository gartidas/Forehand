import { createContext, FC, useContext, useEffect, useMemo, useState } from 'react'
import {
  IConsumerGoods,
  IGiftCard,
  IReservation,
  ISubscriptionCard,
  OrderItemType
} from '../domainTypes'
import api from '../api/httpClient'

export const CART_ITEMS = 'FOREHAND.cart_items'
export const CART_ITEMS_RESERVATIONS = `${CART_ITEMS}.reservations`
export const CART_ITEMS_CONSUMER_GOODS = `${CART_ITEMS}.consumer_goods`
export const CART_ITEMS_GIFT_CARDS = `${CART_ITEMS}.gift_cards`
export const CART_ITEMS_SUBSCRIPTION_CARD = `${CART_ITEMS}.subscription_cards`

interface IOrdersContextValue {
  reservations?: IReservation[]
  consumerGoods?: IConsumerGoods[]
  giftCards?: IGiftCard[]
  subscriptionCard: ISubscriptionCard | null
  orderItemsCount: number
  addReservation: (reservation: IReservation) => void
  addConsumerGoods: (consumerGoods: IConsumerGoods) => void
  addGiftCard: (giftCard: IGiftCard) => void
  addSubscriptionCard: (subscriptionCard: ISubscriptionCard) => void
  removeOrderItem: (orderItemId: string, type: OrderItemType) => void
  clearCart: (isLogout: boolean) => void
}

const OrdersContext = createContext<IOrdersContextValue>(null!)
export const useOrders = () => useContext(OrdersContext)

const getOrderItemsFromStorage = (key: string) => {
  const json = localStorage.getItem(key)
  if (!json) return []

  return JSON.parse(json)
}

const getSubscriptionCardFromStorage = (key: string) => {
  const json = localStorage.getItem(key)
  if (!json) return null

  return JSON.parse(json)
}

const removeReservation = async (reservationId: string) => {
  try {
    await api.delete(`/reservations/${reservationId}`)
  } catch (_) {}
}

const OrdersProvider: FC = ({ children }) => {
  const [reservations, setReservations] = useState<IReservation[]>(
    getOrderItemsFromStorage(CART_ITEMS_RESERVATIONS)
  )
  const [consumerGoods, setConsumerGoods] = useState<IConsumerGoods[]>(
    getOrderItemsFromStorage(CART_ITEMS_CONSUMER_GOODS)
  )
  const [giftCards, setGiftCards] = useState<IGiftCard[]>(
    getOrderItemsFromStorage(CART_ITEMS_GIFT_CARDS)
  )

  const [subscriptionCard, setSubscriptionCard] = useState<ISubscriptionCard | null>(
    getSubscriptionCardFromStorage(CART_ITEMS_SUBSCRIPTION_CARD)
  )

  const orderItemsCount = useMemo(
    () =>
      reservations.length + consumerGoods.length + giftCards.length + (subscriptionCard ? 1 : 0),
    [reservations, consumerGoods, giftCards, subscriptionCard]
  )

  useEffect(() => {
    localStorage.setItem(CART_ITEMS_RESERVATIONS, JSON.stringify(reservations))
    localStorage.setItem(CART_ITEMS_CONSUMER_GOODS, JSON.stringify(consumerGoods))
    localStorage.setItem(CART_ITEMS_GIFT_CARDS, JSON.stringify(giftCards))
    localStorage.setItem(CART_ITEMS_SUBSCRIPTION_CARD, JSON.stringify(subscriptionCard))
  }, [reservations, consumerGoods, giftCards, subscriptionCard])

  const addReservation = (reservation: IReservation) => {
    setReservations(prev => (prev ? [...prev, reservation] : [reservation]))
  }

  const addConsumerGoods = (consumerGoods: IConsumerGoods) => {
    setConsumerGoods(prev => (prev ? [...prev, consumerGoods] : [consumerGoods]))
  }

  const addGiftCard = (giftCard: IGiftCard) => {
    setGiftCards(prev => (prev ? [...prev, giftCard] : [giftCard]))
  }

  const addSubscriptionCard = (subscriptionCard: ISubscriptionCard) => {
    setSubscriptionCard(subscriptionCard)
  }

  const removeOrderItem = async (orderItemId: string, type: OrderItemType) => {
    switch (type) {
      case OrderItemType.Reservation:
        setReservations(prev => prev?.filter(x => x.id !== orderItemId))
        break
      case OrderItemType.ConsumerGoods:
        setConsumerGoods(prev => prev?.filter(x => x.id !== orderItemId))
        break
      case OrderItemType.GiftCard:
        setGiftCards(prev => prev?.filter(x => x.id !== orderItemId))
        break
      case OrderItemType.SubscriptionCard:
        setSubscriptionCard(null)
        break
      default:
        break
    }
  }

  const clearCart = (isLogout: boolean) => {
    isLogout && reservations.forEach(reservation => removeReservation(reservation.id))
    setReservations([])
    setConsumerGoods([])
    setGiftCards([])
    setSubscriptionCard(null)
  }

  const value: IOrdersContextValue = {
    reservations,
    consumerGoods,
    giftCards,
    subscriptionCard,
    orderItemsCount,
    addReservation,
    addConsumerGoods,
    addGiftCard,
    addSubscriptionCard,
    removeOrderItem,
    clearCart
  }

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export default OrdersProvider
