import api, { setAuthHeader } from '../api/httpClient'
import { IApiError } from '../api/types'
import { AxiosInstance } from 'axios'
import { ICurrentUser } from '../domainTypes'

export const logout = async () => {
  try {
    await api.post('/auth/logout')
  } catch {
    //pass
  }
  setAuthHeader(undefined)
}

export const fetchCurrentUser = async () => {
  const hasAuthHeader = !!api.defaults.headers.common['Authorization']

  try {
    if (!hasAuthHeader) {
      await refreshToken()
    }
    const res = await api.get('/auth/me')
    return res.data as ICurrentUser
  } catch (err) {
    return undefined
  }
}

/**
 * @returns true or error message
 */
export const login = async (body: { email: string; password: string }) => {
  try {
    const res = await api.post('/auth/login', body)
    setAuthHeader(res.data.accessToken)
    return true
  } catch (err) {
    return err as IApiError
  }
}

/**
 * @returns accessToken
 */
export const refreshToken = async (client: AxiosInstance = api): Promise<string> => {
  try {
    const response = await client.get('/auth/refresh-token')
    const { accessToken } = response.data
    setAuthHeader(accessToken)
    return Promise.resolve(accessToken)
  } catch (_) {
    return Promise.reject('FAILED TO REFRESH TOKEN')
  }
}
