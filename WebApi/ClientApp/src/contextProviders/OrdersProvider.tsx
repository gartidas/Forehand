import { createContext, FC, useContext, useEffect, useMemo, useState } from 'react'
import { IConsumerGoods, IGiftCard, IReservation, OrderItemType } from '../domainTypes'

export const CART_ITEMS = 'FOREHAND.cart_items'
export const CART_ITEMS_RESERVATIONS = `${CART_ITEMS}.reservations`
export const CART_ITEMS_CONSUMER_GOODS = `${CART_ITEMS}.consumer_goods`
export const CART_ITEMS_GIFT_CARDS = `${CART_ITEMS}.gift_cards`

interface IOrdersContextValue {
  reservations?: IReservation[]
  consumerGoods?: IConsumerGoods[]
  giftCards?: IGiftCard[]
  orderItemsCount: number
  addReservation: (reservation: IReservation) => void
  addConsumerGoods: (consumerGoods: IConsumerGoods) => void
  addGiftCard: (giftCard: IGiftCard) => void
  removeOrderItem: (orderItemId: string, type: OrderItemType) => void
  clearCart: () => void
}

const OrdersContext = createContext<IOrdersContextValue>(null!)
export const useOrders = () => useContext(OrdersContext)

const getOrderItemsFromStorage = (key: string) => {
  const json = localStorage.getItem(key)
  if (!json) return []

  return JSON.parse(json)
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

  const orderItemsCount = useMemo(
    () => reservations.length + consumerGoods.length + giftCards.length,
    [reservations, consumerGoods, giftCards]
  )

  useEffect(() => {
    localStorage.setItem(CART_ITEMS_RESERVATIONS, JSON.stringify(reservations))
    localStorage.setItem(CART_ITEMS_CONSUMER_GOODS, JSON.stringify(consumerGoods))
    localStorage.setItem(CART_ITEMS_GIFT_CARDS, JSON.stringify(giftCards))
  }, [reservations, consumerGoods, giftCards])

  const addReservation = (reservation: IReservation) => {
    setReservations(prev => (prev ? [...prev, reservation] : [reservation]))
  }

  const addConsumerGoods = (consumerGoods: IConsumerGoods) => {
    setConsumerGoods(prev => (prev ? [...prev, consumerGoods] : [consumerGoods]))
  }

  const addGiftCard = (giftCard: IGiftCard) => {
    setGiftCards(prev => (prev ? [...prev, giftCard] : [giftCard]))
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
      default:
        break
    }
  }

  const clearCart = () => {
    setReservations([])
    setConsumerGoods([])
    setGiftCards([])
  }

  const value: IOrdersContextValue = {
    reservations,
    consumerGoods,
    giftCards,
    orderItemsCount,
    addReservation,
    addConsumerGoods,
    addGiftCard,
    removeOrderItem,
    clearCart
  }

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export default OrdersProvider
