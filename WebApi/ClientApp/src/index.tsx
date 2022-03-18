import { ChakraProvider } from '@chakra-ui/react'
import * as React from 'react'
import ReactDOM from 'react-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import AuthProvider from './contextProviders/AuthProvider'
import ReservationsProvider from './contextProviders/ReservationsProvider'
import * as serviceWorker from './serviceWorker'
import theme from './styles/theme'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } }
})

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ReservationsProvider>
            <ChakraProvider theme={theme}>
              <App />
            </ChakraProvider>
          </ReservationsProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

serviceWorker.unregister()
