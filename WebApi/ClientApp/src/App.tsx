import { ChakraProvider, Box, theme } from '@chakra-ui/react'

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign='start' fontSize='3xl'>
        WORKS
      </Box>
    </ChakraProvider>
  )
}

export default App
