import {
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text
} from '@chakra-ui/react'
import { useNavigate } from 'react-router'
import { useAuthorizedUser } from '../../../contextProviders/AuthProvider'
import roleColors from '../../../styles/roleColors'

const MenuDropdown = () => {
  const { currentUser, logout } = useAuthorizedUser()
  const navigate = useNavigate()

  return (
    <Flex
      alignItems={'center'}
      flex={{ base: 1, md: 0 }}
      justify={{ base: 'flex-end', md: 'flex-start' }}
    >
      <Menu>
        <MenuButton as={Button} rounded={'full'} variant={'link'} cursor={'pointer'} minW={0}>
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
          <MenuItem onClick={() => navigate(`/users/${currentUser.id}`)}>Profile</MenuItem>
          <MenuItem>Settings</MenuItem>
          <MenuDivider />
          <MenuItem onClick={() => logout()}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  )
}

export default MenuDropdown
