import { Avatar } from '@chakra-ui/avatar'
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import { Text, Flex } from '@chakra-ui/layout'
import { Button, ChakraProps } from '@chakra-ui/react'
import { useState } from 'react'
import { IUser } from '../../domainTypes'
import roleColors from '../../styles/roleColors'
import api from '../../api/httpClient'
import { apiErrorToast } from '../../services/toastService'
import { IApiError } from '../../api/types'

interface UserItemProps extends ChakraProps {
  user: IUser
  onButtonClick: () => void
}

const UserItem = ({ user, onButtonClick, ...rest }: UserItemProps) => {
  const [changingStatus, setChangingStatus] = useState(false)

  const handleStatusChanged = async () => {
    setChangingStatus(true)
    try {
      await api.patch(`/users/${user.id}/change-registration-status`, {
        registrationStatus: !user.registrationConfirmed
      })
    } catch (err) {
      apiErrorToast(err as IApiError)
    }
    onButtonClick()
    setChangingStatus(false)
  }

  return (
    <Flex
      my={1}
      border='solid 1px'
      borderColor='primary'
      borderRadius='lg'
      p={3}
      direction='row'
      alignItems='center'
      justifyContent='space-between'
      {...rest}
    >
      <Flex alignItems='center'>
        <Avatar
          size={'sm'}
          src={`https://avatars.dicebear.com/api/adventurer-neutral/${user.id}.svg`}
          marginRight={2}
          border={`2px solid ${roleColors[user.role]}`}
        />
        <Flex direction='column'>
          <Text>
            {user.givenName} {user.surname}
          </Text>
          <Text>{user.email}</Text>
        </Flex>
      </Flex>
      <Button variant='primary' isLoading={changingStatus} onClick={handleStatusChanged}>
        {user.registrationConfirmed ? (
          <>
            <CloseIcon color='red.300' marginRight={2} />
            <Text color='red.300' display={{ base: 'none', md: 'block' }}>
              Revoke registration
            </Text>
          </>
        ) : (
          <>
            <CheckIcon color='green.300' marginRight={2} />
            <Text color='green.300' display={{ base: 'none', md: 'block' }}>
              Confirm registration
            </Text>
          </>
        )}
      </Button>
    </Flex>
  )
}

export default UserItem
