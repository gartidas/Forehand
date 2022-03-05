import { IApiError } from '../api/types'

export const getApiErrorMessage = (err: IApiError) => {
  if (err.data.errorCode === 'ValidationError')
    return err.data.errorDetails[0]?.message || 'Something went wrong :('
  return err.data.errorMessage || err.data.errorCode || 'Something went wrong :('
}
