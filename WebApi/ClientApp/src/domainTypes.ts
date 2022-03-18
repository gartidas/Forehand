import { UseFormMethods } from 'react-hook-form'

export type Validator<TFormValues = any, TValue = any> = (
  value: TValue,
  form: UseFormMethods<TFormValues>
) => string | undefined

export type SubmitFormatter<T> = (values: T, form: UseFormMethods<T>) => Record<string, any>

export interface IUserExtended extends IUser {
  phoneNumber: string
  bio?: string
  rating?: number
  numberOfRatings?: number
  reservationPrice?: number
  hasCurrentUserRatedUser?: boolean
}

export interface IUser {
  id: string
  email: string
  givenName: string
  surname: string
  role: Role
  registrationConfirmed?: boolean
}

export enum Role {
  None = 0,
  BasicUser = 1,
  Employee = 2,
  Trainer = 3,
  Admin = 4
}

export interface ICourt {
  id: string
  reservationPrice: number
  label: string
  description: string
}

export interface ISportsGear {
  id: string
  reservationPrice: number
  registrationNumber: string
  shoppingPrice: number
  name: string
  productionYear: string
  physicalState: PhysicalState
  manufacturer: string
}

export enum PhysicalState {
  None = 0,
  New = 1,
  Used = 2,
  WornOut = 3,
  Damaged = 4,
  Discarded = 5
}

export interface IGiftCard {
  id: string
  price: number
  value: number
  code: string
  name: string
}

export interface IConsumerGoods {
  id: string
  price: number
  expirationDate: string
  productionDate: string
  name: string
  manufacturer: string
}

export interface IReservation {
  id: string
  price: number
  startDate: string
  endDate: string
  reservationState: ReservationState
  court: ICourt
  trainer: IUserExtended
  customer: IUser
  sportsGear: ISportsGear[]
}

export enum ReservationState {
  Unknown = 0,
  Planned = 1,
  Confirmed = 2,
  Declined = 3,
  Fulfilled = 4,
  NotFulfilled = 5
}
