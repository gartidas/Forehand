import { Toaster } from 'react-hot-toast'
import Routes from './Routes'
import { toastOptions } from './services/toastService'

const App = () => {
  return (
    <>
      <Toaster toastOptions={toastOptions} />
      <Routes />
    </>
  )
}

export default App
