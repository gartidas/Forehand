import {
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  Icon
} from '@chakra-ui/react'
import { useNavigate } from 'react-router'
import { useAuthorizedUser } from '../../../contextProviders/AuthProvider'
import roleColors from '../../../styles/roleColors'
import { AiOutlineLogout, AiOutlineUser } from 'react-icons/ai'
import { FiSettings } from 'react-icons/fi'
import CartIcon from '../../elements/CartIcon'

const MenuDropdown = () => {
  const { currentUser, logout } = useAuthorizedUser()
  const navigate = useNavigate()

  return (
    <Flex
      alignItems={'center'}
      flex={{ base: 1, lg: 0 }}
      justify={{ base: 'flex-end', lg: 'flex-start' }}
    >
      <Menu>
        <MenuButton
          as={Button}
          rounded={'full'}
          variant={'link'}
          cursor={'pointer'}
          minW={0}
          paddingRight={2}
        >
          <Flex alignItems='center'>
            <Avatar
              size={'sm'}
              src={`https://avatars.dicebear.com/api/adventurer-neutral/${currentUser.id}.svg`}
              marginRight={2}
              border={`2px solid ${roleColors[currentUser.role]}`}
            />
            <Text
              fontFamily={'heading'}
              color={'primary'}
              fontSize={{ base: 'smaller', md: 'medium' }}
            >
              {currentUser.email}
            </Text>
          </Flex>
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => navigate(`/users/${currentUser.id}`)}>
            <Flex width='full' justifyContent='center'>
              <Icon as={AiOutlineUser} />
            </Flex>
          </MenuItem>
          <MenuItem onClick={() => navigate(`/cart`)}>
            <Flex width='full' justifyContent='center'>
              <CartIcon />
            </Flex>
          </MenuItem>
          <MenuItem onClick={() => navigate(`/settings/change-password`)}>
            <Flex width='full' justifyContent='center'>
              <Icon as={FiSettings} />
            </Flex>
          </MenuItem>
          <MenuDivider />
          <MenuItem onClick={() => logout()}>
            <Flex width='full' justifyContent='center'>
              <Icon as={AiOutlineLogout} />
            </Flex>
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  )
}

export default MenuDropdown
