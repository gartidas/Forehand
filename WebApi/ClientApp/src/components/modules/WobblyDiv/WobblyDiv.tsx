import { Box, BoxProps } from '@chakra-ui/react'
import styled, { keyframes } from 'styled-components'

const wobbleAnimation = keyframes`
  25% {
    transform: rotate(15deg);
  }
  50% {
    transform: rotate(-18deg);
  }
  75% {
    transform: rotate(5deg);
  }
  100% {
    transform: rotate(0deg);
  }
`

const WobblyContainer = styled(Box)`
  animation: 2s ${wobbleAnimation} infinite;

  &:hover {
    animation: none;
  }
`
export const WobblyDiv = (props: BoxProps) => {
  return <WobblyContainer {...props}></WobblyContainer>
}
