import moment from 'moment'
import { IApiError } from '../api/types'

export const getApiErrorMessage = (err: IApiError) => {
  if (err.data.errorCode === 'ValidationError')
    return err.data.errorDetails[0]?.message || 'Something went wrong :('
  return err.data.errorMessage || err.data.errorCode || 'Something went wrong :('
}

export const formatDateForInput = (date: string) => moment(date).format('YYYY-MM-DD')

export const formatDateForCalendar = (date: string) => moment(date).format('YYYY-MM-DD HH:mm')

export const formatDateForForm = (date: string) => moment(date).format('dddd DD.MM.')

export const toLocalTime = (date: string | Date, format?: string) => {
  const utc = moment.utc(date).toDate()
  return moment(utc)
    .local()
    .format(format || 'DD MMMM yyyy, HH:mm')
}
