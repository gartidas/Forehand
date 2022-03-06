import { Flex, Heading, Text, useBreakpointValue } from '@chakra-ui/react'
import { FOOTER_HEIGHT } from '../../../components/modules/Footer/Footer'
import { NAVBAR_HEIGHT } from '../../../components/modules/Navbar/Navbar'
import { useAuthorizedUser } from '../../../contextProviders/AuthProvider'

export default function Hero() {
  const { currentUser } = useAuthorizedUser()

  return (
    <Flex
      p={8}
      align={'center'}
      justify={'center'}
      height={`calc(100vh - (${NAVBAR_HEIGHT} + ${FOOTER_HEIGHT}))`}
    >
      <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }} textAlign='center'>
        <Text as={'span'} color={'primary'}>
          Welcome back
        </Text>{' '}
        <Text
          color={'primary'}
          as={'span'}
          position={'relative'}
          fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
          marginLeft={{ base: 0, md: 2 }}
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
          {currentUser.givenName}
        </Text>
        <br />{' '}
        <Text color={'secondary'} as={'span'} marginTop={{ base: '4px', md: '0' }}>
          What can we do for you today?
        </Text>{' '}
      </Heading>
    </Flex>
  )
}
