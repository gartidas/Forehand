import axios from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import { refreshToken } from '../services/authService'
import { IS_SIGNED_IN_LOCAL_STORAGE_KEY } from '../contextProviders/AuthProvider'

const client = axios.create({ baseURL: `${window.location.origin}/api` })

createAuthRefreshInterceptor(client, failedRequest =>
  refreshToken(client)
    .then(accessToken => {
      failedRequest.response.config.headers.Authorization = `Bearer ${accessToken}`
      return Promise.resolve()
    })
    .catch(_ => {
      const { href, origin } = window.location
      const path = href.replace(origin, '')
      window.location.assign(`/login?redirectedFrom=${path}`)
      localStorage.removeItem(IS_SIGNED_IN_LOCAL_STORAGE_KEY)
    })
)

//Note: Keep this line bellow "createAuthRefreshInterceptor()" since it needs entire error object being returned
client.interceptors.response.use(undefined, error => Promise.reject(error.response))

export const setAuthHeader = (accessToken?: string) => {
  client.defaults.headers.common['Authorization'] = accessToken ? `Bearer ${accessToken}` : ''
}

export default client
