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
  reservationPrice?: number
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
