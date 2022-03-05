import { Box, Flex, HStack, Button, useDisclosure, Stack, Divider } from '@chakra-ui/react'
import { useAuth } from '../../../contextProviders/AuthProvider'
import { useNavigate } from 'react-router'
import { Logo } from '../../elements/Logo'
import Burger from '../../elements/Burger'
import MenuDropdown from '../MenuDropdown/MenuDropdown'
import NavButtons from './NavButtons/NavButtons'
import { LoggedInNavButtons, LoggedOutNavButtons } from './types'

export const NAVBAR_HEIGHT = '64px'

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const auth = useAuth()
  const { isLoggedIn } = auth
  const navigate = useNavigate()

  return (
    <Box height={NAVBAR_HEIGHT} bg={'bg2'} position='sticky' px={4} top={0} zIndex={100}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Burger isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
        <HStack spacing={8} alignItems={'center'}>
          <Logo />
          <Divider
            orientation='vertical'
            variant='dashed'
            borderColor='primary'
            height={10}
            display={{ base: 'none', md: 'block' }}
          />
          <NavButtons
            buttons={isLoggedIn ? LoggedInNavButtons[auth.currentUser.role] : LoggedOutNavButtons}
            isMobileNavbar={false}
          />
        </HStack>

        {isLoggedIn ? (
          <MenuDropdown />
        ) : (
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={{ base: 'flex-end', md: 'flex-start' }}
            direction='row'
            spacing={6}
          >
            <Button variant='link' onClick={() => navigate('/login')}>
              Sign In
            </Button>

            <Button variant='secondary' onClick={() => navigate('/register')}>
              Sign Up
            </Button>
          </Stack>
        )}
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <NavButtons
            buttons={isLoggedIn ? LoggedInNavButtons[auth.currentUser.role] : LoggedOutNavButtons}
            isMobileNavbar={true}
          />
        </Box>
      ) : null}
    </Box>
  )
}

export default Navbar
