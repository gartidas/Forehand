import { extendTheme } from '@chakra-ui/react'
import { ButtonStyles } from './components/ButtonStyles'

const theme = extendTheme({
  colors: {
    primary: '#1A202C',
    secondary: '#68D391',
    tertiary: '#718096',
    bg: '#FFFFFF',
    bg2: '#F7FAFC'
  },
  components: {
    Button: ButtonStyles
  }
})

export default theme
