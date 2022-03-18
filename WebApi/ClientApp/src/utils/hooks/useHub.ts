import { useState, useEffect } from 'react'
import * as signalR from '@microsoft/signalr'

import api from '../../api/httpClient'
import { useAuth } from '../../contextProviders/AuthProvider'

export type DisconnectType = 'connecting' | 'temporary' | 'permanent'

const getJwt = () => {
  const authHeader: string | undefined = api.defaults.headers['Authorization']
  return authHeader ? authHeader.replace('Bearer ', '') : ''
}

const useHub = (url: string) => {
  const [hubConnection, setConnection] = useState<signalR.HubConnection>()
  const [disconnected, setDisconnected] = useState<DisconnectType | undefined>('connecting')
  const { isLoggedIn } = useAuth()

  useEffect(() => {
    if (!isLoggedIn) return

    let timeoutId: any

    const tryToConnect = async (connection: signalR.HubConnection, timeout: number) => {
      try {
        await connection.start()
        setDisconnected(undefined)
      } catch (_) {
        if (timeout > 30000) {
          setDisconnected('permanent')
        } else {
          setDisconnected('temporary')

          timeoutId = setTimeout(() => tryToConnect(connection, timeout * 2), timeout)
        }
      }
    }

    const setupConnection = async () => {
      const hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(api.defaults.baseURL + url, {
          accessTokenFactory: getJwt,
          transport: signalR.HttpTransportType.WebSockets,
          skipNegotiation: true
        })
        .withAutomaticReconnect()
        .build()

      hubConnection.onreconnecting(() => setDisconnected('temporary'))
      hubConnection.onclose(() => setDisconnected('permanent'))
      hubConnection.onreconnected(() => setDisconnected(undefined))

      tryToConnect(hubConnection, 2000)
      setConnection(hubConnection)
    }

    setupConnection()

    return () => clearTimeout(timeoutId)
  }, [url, isLoggedIn, setDisconnected, setConnection])

  useEffect(() => {
    if (!isLoggedIn) hubConnection?.stop()
  }, [isLoggedIn, hubConnection])

  return { hubConnection, disconnected }
}

export default useHub
