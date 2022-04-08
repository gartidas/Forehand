import { IconButton } from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'

interface IBurgerProps {
  onOpen: () => void
  onClose: () => void
  isOpen: boolean
}

const Burger = ({ isOpen, onClose, onOpen }: IBurgerProps) => {
  return (
    <IconButton
      backgroundColor={'bg2'}
      size={'md'}
      icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
      aria-label={'Open Menu'}
      display={{ lg: 'none' }}
      onClick={isOpen ? onClose : onOpen}
    />
  )
}

export default Burger
