import { Box } from '@chakra-ui/react'
import DefaultLayout from '../../components/layouts/DefaultLayout'
import Features from './Features'

const About = () => {
  return (
    <Box overflowX='hidden'>
      <DefaultLayout showFooter>
        <Features />
      </DefaultLayout>
    </Box>
  )
}

export default About
