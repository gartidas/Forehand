import { Box, Container, Heading, Image, useBreakpointValue } from '@chakra-ui/react'
import createAccountImg from '../../img/create-account.png'
import createReservationImg from '../../img/create-reservation.png'
import addTrainer from '../../img/add-trainer.png'
import addSportsGear from '../../img/add-sports-gear.png'
import submit from '../../img/submit.png'
import checkOut from '../../img/check-out.png'
import enjoy from '../../img/enjoy.png'

const Features = () => {
  const titleSize = useBreakpointValue({ base: '1.3rem', md: '4xl' })

  return (
    <Box>
      <Heading
        textAlign='center'
        fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
        mt={6}
        color='secondary'
      >
        Let's see how it easy it is to make a reservation!
      </Heading>
      <Box background='bg'>
        <Container maxW='6xl'>
          <Box py={10}>
            <Heading textAlign='center' fontSize={titleSize} mb={6}>
              Create your account...
            </Heading>

            <Box>
              <Image
                mx='auto'
                src={createAccountImg}
                borderRadius='xl'
                maxH='100%'
                boxShadow='xl'
              />
            </Box>
          </Box>
        </Container>
      </Box>

      <Box>
        <Container maxW='6xl'>
          <Box py={10}>
            <Heading textAlign='center' fontSize={titleSize} mb={6}>
              Create your first reservation...
            </Heading>

            <Box>
              <Image
                mx='auto'
                src={createReservationImg}
                borderRadius='xl'
                maxH='100%'
                boxShadow='xl'
              />
            </Box>
          </Box>
        </Container>
      </Box>

      <Box background='bg'>
        <Container maxW='6xl'>
          <Box py={10}>
            <Heading textAlign='center' fontSize={titleSize} mb={6}>
              Add trainer...
            </Heading>

            <Box>
              <Image mx='auto' src={addTrainer} borderRadius='xl' maxH='100%' boxShadow='xl' />
            </Box>
          </Box>
        </Container>
      </Box>

      <Box>
        <Container maxW='6xl'>
          <Box py={10}>
            <Heading textAlign='center' fontSize={titleSize} mb={6}>
              Add sports gear you like...
            </Heading>

            <Box>
              <Image mx='auto' src={addSportsGear} borderRadius='xl' maxH='100%' boxShadow='xl' />
            </Box>
          </Box>
        </Container>
      </Box>

      <Box background='bg'>
        <Container maxW='6xl'>
          <Box py={10}>
            <Heading textAlign='center' fontSize={titleSize} mb={6}>
              Submit the reservation...
            </Heading>

            <Box>
              <Image mx='auto' src={submit} borderRadius='xl' maxH='100%' boxShadow='xl' />
            </Box>
          </Box>
        </Container>
      </Box>

      <Box>
        <Container maxW='6xl'>
          <Box py={10}>
            <Heading textAlign='center' fontSize={titleSize} mb={6}>
              Check out...
            </Heading>

            <Box>
              <Image mx='auto' src={checkOut} borderRadius='xl' maxH='100%' boxShadow='xl' />
            </Box>
          </Box>
        </Container>
      </Box>

      <Box>
        <Container maxW='6xl'>
          <Box py={10}>
            <Heading textAlign='center' fontSize={titleSize} mb={6}>
              Enjoy!
            </Heading>

            <Box>
              <Image mx='auto' src={enjoy} borderRadius='xl' maxH='100%' boxShadow='xl' />
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default Features
