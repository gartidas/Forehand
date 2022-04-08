import { HStack, Button, Stack } from '@chakra-ui/react'
import { useNavigate } from 'react-router'
import { INabButtonProps } from '../types'

interface INavButtonsProps {
  buttons: INabButtonProps[]
  isMobileNavbar: boolean
  onClick?: () => void
}

const NavButtons = ({ buttons, isMobileNavbar, onClick }: INavButtonsProps) => {
  const navigate = useNavigate()

  return (
    <>
      {isMobileNavbar ? (
        <Stack as={'nav'} spacing={{ base: 0, lg: 4 }} display={{ base: 'flex', lg: 'none' }}>
          {buttons.map(button => (
            <Button
              key={button.label}
              variant='primary'
              onClick={() => {
                onClick && onClick()
                navigate(button.url)
              }}
            >
              {button.label}
            </Button>
          ))}
        </Stack>
      ) : (
        <HStack as={'nav'} spacing={{ base: 0, lg: 4 }} display={{ base: 'none', lg: 'flex' }}>
          {buttons.map(button => (
            <Button
              key={button.label}
              variant='primary'
              onClick={() => {
                onClick && onClick()
                navigate(button.url)
              }}
            >
              {button.label}
            </Button>
          ))}
        </HStack>
      )}
    </>
  )
}

export default NavButtons
