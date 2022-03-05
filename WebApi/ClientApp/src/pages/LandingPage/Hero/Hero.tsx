import { Button, Flex, Heading, Image, Stack, Text, useBreakpointValue } from '@chakra-ui/react'
import { useNavigate } from 'react-router'
import { FOOTER_HEIGHT } from '../../../components/modules/Footer/Footer'
import { NAVBAR_HEIGHT } from '../../../components/modules/Navbar/Navbar'
import styled, { keyframes } from 'styled-components'

const bounceAnimation = keyframes`
  from { 
    transform: translateY(0) scale(1);
  }
  to   { 
    transform: translateY(calc(50vh - ${NAVBAR_HEIGHT})) scale(1, 0.7);
  }
`

const BouncyDiv = styled.div`
  max-width: 300px;
  height: auto;
  position: relative;
  top: calc(0 + ${NAVBAR_HEIGHT});
  overflow: hidden;
  animation: 1s ${bounceAnimation} infinite alternate cubic-bezier(0.95, 0.05, 0.795, 0.035);
  border-radius: 50%;
`

export default function Hero() {
  const navigate = useNavigate()

  return (
    <Stack
      height={`calc(100vh - (${NAVBAR_HEIGHT} + ${FOOTER_HEIGHT}))`}
      direction='row'
      align='center'
    >
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Stack spacing={6} w={'full'} maxW={'lg'}>
          <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
            <Text
              as={'span'}
              position={'relative'}
              _after={{
                content: "''",
                width: 'full',
                height: useBreakpointValue({ base: '20%', md: '30%' }),
                position: 'absolute',
                bottom: 1,
                left: 0,
                bg: 'secondary',
                zIndex: -1
              }}
            >
              Forehand
            </Text>
            <br />{' '}
            <Text color={'secondary'} as={'span'}>
              Reserve your tennis session today!
            </Text>{' '}
          </Heading>
          <Text fontSize={{ base: 'md', lg: 'lg' }} color={'primary'}>
            Forehand is a easy to use reservation app. Choose from the range of tennis courts,
            trainers and sports gear at the same time.
          </Text>
          <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
            <Button rounded={'full'} variant='secondary' onClick={() => navigate('/register')}>
              Get started
            </Button>
            <Button rounded={'full'} variant='primary' onClick={() => navigate('/about')}>
              How It Works
            </Button>
          </Stack>
        </Stack>
      </Flex>
      <Flex
        display={{ base: 'none', lg: 'flex' }}
        flex={1}
        alignItems='center'
        direction='column'
        height='100%'
      >
        <BouncyDiv>
          <Image
            alt='Tennis player'
            src='https://static.wixstatic.com/media/981f56_2194e799c11c492aa9e6388961d73246~mv2.gif'
            objectFit='cover'
            borderRadius='50%'
            height='300px'
            width='300px'
          />
        </BouncyDiv>
      </Flex>
    </Stack>
  )
}
