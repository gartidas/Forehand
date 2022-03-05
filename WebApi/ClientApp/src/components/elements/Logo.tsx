import { Flex, Text, useBreakpointValue, Image, ImageProps } from '@chakra-ui/react'

export const Icon = (props: ImageProps) => {
  return (
    <Image
      {...props}
      height={8}
      viewBox='0 0 120 28'
      src='http://cdn.onlinewebfonts.com/svg/img_533278.png'
      filter='invert(83%) sepia(9%) saturate(2030%) hue-rotate(86deg) brightness(90%) contrast(88%)'
    />
  )
}

export const Logo = () => {
  return (
    <Flex alignItems={'center'}>
      <Icon display={{ base: 'none', md: 'flex' }} />
      <Text
        marginLeft={2}
        textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
        fontFamily={'heading'}
        color={'primary'}
      >
        Forehand
      </Text>
    </Flex>
  )
}
