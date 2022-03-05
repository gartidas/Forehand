import { Box, Container } from '@chakra-ui/layout'
import { SlideFade } from '@chakra-ui/react'
import { useLocation } from 'react-router'
import Footer from '../modules/Footer/Footer'
import Navbar from '../modules/Navbar/Navbar'

interface IDefaultLayoutProps {
  children: JSX.Element
  showFooter?: boolean
}

const DefaultLayout = ({ children, showFooter }: IDefaultLayoutProps) => {
  const { pathname } = useLocation()
  return (
    <Box height='100vh' overflowY='auto'>
      <Navbar />

      <Container maxW='6xl'>
        <SlideFade key={pathname} in offsetY={0} offsetX={-10}>
          {children}
        </SlideFade>
      </Container>
      {showFooter && <Footer />}
    </Box>
  )
}

export default DefaultLayout
