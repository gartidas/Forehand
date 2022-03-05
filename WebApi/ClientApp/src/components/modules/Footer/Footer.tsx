import { Box, Container, Stack, Text, useBreakpointValue } from '@chakra-ui/react'

export const FOOTER_HEIGHT = '56px'

export default function Footer() {
  return (
    <Box bg={'bg2'} color={'primary'} height={FOOTER_HEIGHT}>
      <Container
        as={Stack}
        maxW={'6xl'}
        py={4}
        direction={{ base: 'column', md: 'row' }}
        justify={{ base: 'center', md: 'center' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Text
          textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
          fontFamily={'heading'}
          color={'primary'}
        >
          © 2022 Forehand. All rights reserved
        </Text>
      </Container>
    </Box>
  )
}
