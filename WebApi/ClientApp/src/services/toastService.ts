import toast, { ToastOptions } from 'react-hot-toast'
import { IApiError } from '../api/types'
import { getApiErrorMessage } from '../utils'

export const toastOptions: ToastOptions = {
  position: 'bottom-left',
  duration: 4000
}

export const successToast = (message: string) => toast.success(message)

export const errorToast = (message: string) => toast.error(message)

export const errorToastIfNotValidationError = (err: IApiError['data']) => {
  err.errorCode !== 'ValidationError' && errorToast(err.errorMessage)
}

export const apiErrorToast = (err: IApiError) => errorToast(getApiErrorMessage(err))
