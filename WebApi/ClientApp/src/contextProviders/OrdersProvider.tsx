import { createContext, FC, useContext, useEffect, useMemo, useState } from 'react'
import { IReservation, OrderItemType } from '../domainTypes'

export const CART_ITEMS = 'FOREHAND.cart_items'
export const CART_ITEMS_RESERVATIONS = `${CART_ITEMS}.reservations`

interface IOrdersContextValue {
  reservations?: IReservation[]
  orderItemsCount: number
  addReservation: (reservation: IReservation) => void
  removeOrderItem: (orderItemId: string, type: OrderItemType) => void
  clearCart: () => void
}

const OrdersContext = createContext<IOrdersContextValue>(null!)
export const useOrders = () => useContext(OrdersContext)

const getReservationsFromStorage = () => {
  const json = localStorage.getItem(CART_ITEMS_RESERVATIONS)
  if (!json) return []

  return JSON.parse(json)
}

const OrdersProvider: FC = ({ children }) => {
  const [reservations, setReservations] = useState<IReservation[]>(getReservationsFromStorage)

  const orderItemsCount = useMemo(() => reservations.length, [reservations])

  useEffect(() => {
    localStorage.setItem(CART_ITEMS_RESERVATIONS, JSON.stringify(reservations))
  }, [reservations])

  const addReservation = (reservation: IReservation) => {
    setReservations(prev => (prev ? [...prev, reservation] : [reservation]))
  }

  const removeOrderItem = async (orderItemId: string, type: OrderItemType) => {
    switch (type) {
      case OrderItemType.Reservation:
        setReservations(prev => prev?.filter(x => x.id !== orderItemId))
        break

      default:
        break
    }
  }

  const clearCart = () => {
    setReservations([])
  }

  const value: IOrdersContextValue = {
    reservations,
    orderItemsCount,
    addReservation,
    removeOrderItem,
    clearCart
  }

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}

export default OrdersProvider
