import { Box } from '@chakra-ui/react'
import DefaultLayout from '../../components/layouts/DefaultLayout'
import Hero from './Hero/Hero'

export default function LandingPage() {
  return (
    <Box overflowX='hidden'>
      <DefaultLayout showFooter>
        <Hero />
      </DefaultLayout>
    </Box>
  )
}
