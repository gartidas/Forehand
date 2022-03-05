import { UseFormMethods } from 'react-hook-form'
import { Validator } from '../domainTypes'

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

export const combineValidators =
  (validators: Validator[]) => (value: any, form: UseFormMethods<Record<string, any>>) => {
    for (let i = 0; i < validators.length; i++) {
      const validator = validators[i]
      const result = validator?.(value, form)
      if (result) return result
    }
  }

export const requiredValidator: Validator = (value, t) => (value ? undefined : 'Required')

export const minLengthValidator =
  (minLength: number): Validator =>
  (value: string, t) => {
    if (value) return value.length < minLength ? `Min length: ${minLength}` : undefined
  }

export const maxLengthValidator =
  (maxLength: number): Validator =>
  (value: string, t) => {
    if (value) return value.length > maxLength ? `Max length: ${maxLength}` : undefined
  }

export const minNumericValue =
  (min: number): Validator =>
  (value: number, t) => {
    if (value) return value < min ? `Min: ${min}` : undefined
  }

export const maxNumericValue =
  (max: number): Validator =>
  (value: number, t) => {
    if (value) return value > max ? `Max: ${max}` : undefined
  }

export const emailValidator: Validator = (email: string, t) => {
  if (!email) return undefined
  return emailRegex.test(email) ? undefined : 'Invalid email'
}
