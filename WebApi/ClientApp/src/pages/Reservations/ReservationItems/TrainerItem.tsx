import { Avatar } from '@chakra-ui/avatar'
import { Button, ChakraProps, Box, Text, Flex, Stack, Tooltip } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { IUserExtended } from '../../../domainTypes'
import roleColors from '../../../styles/roleColors'
import useWindowSize from '../../../utils/hooks/useWindowsSize'

interface TrainerItemProps extends ChakraProps {
  trainer: IUserExtended
  onClick?: () => void
  button?: {
    name: string
    variant: string
    text?: string
    onClick: () => void
    icon?: ReactNode
    type?: 'submit' | 'reset' | 'button' | undefined
    isLoading?: boolean
    shake?: boolean
  }
}

const TrainerItem = ({ trainer, button, onClick, ...rest }: TrainerItemProps) => {
  const isDesktop = useWindowSize().height > 1100

  return (
    <Stack
      my={1}
      rounded={'lg'}
      boxShadow={'lg'}
      borderRadius='lg'
      p={3}
      direction='row'
      alignItems='center'
      backgroundColor='bg2'
      justifyContent={button ? 'space-between' : 'space-around'}
      width='full'
      {...rest}
    >
      <Tooltip label={trainer.bio} backgroundColor='secondary'>
        <Flex
          alignItems='center'
          cursor={onClick && isDesktop ? 'pointer' : 'default'}
          onClick={isDesktop ? onClick : () => {}}
        >
          {isDesktop && (
            <Avatar
              size={'sm'}
              src={`https://avatars.dicebear.com/api/adventurer-neutral/${trainer.id}.svg`}
              marginRight={2}
              border={`2px solid ${roleColors[trainer.role]}`}
            />
          )}
          <Flex direction='column'>
            <Text>
              {trainer.givenName} {trainer.surname}
            </Text>
            <Text>{trainer.email}</Text>
          </Flex>
        </Flex>
      </Tooltip>
      <Stack spacing={0} align={'center'}>
        <Text fontSize={'sm'} color={'tertiary'}>
          Price
        </Text>
        <Text fontWeight={600}>{`${trainer.reservationPrice} €/h`}</Text>
      </Stack>
      {button && (
        <Box>
          <Button
            key={button.name}
            name={button.name}
            variant={button.variant}
            onClick={button.onClick}
            type={button.type}
            isLoading={button.isLoading}
          >
            {button.text}
            {button.icon}
          </Button>
        </Box>
      )}
    </Stack>
  )
}

export default TrainerItem
