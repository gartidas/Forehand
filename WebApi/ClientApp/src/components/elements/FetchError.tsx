import { Link } from 'react-router-dom'
import { Button } from '@chakra-ui/button'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/modal'
import { IApiError } from '../../api/types'

interface FetchErrorProps {
  error: IApiError
}

const FetchError = ({ error }: FetchErrorProps) => {
  const getErrorMessage = () => {
    switch (error.status) {
      case 404:
        return 'Resource does not exist or has been deleted.'
      case 403:
        return 'You dont have sufficent permissions to access this resource.'
      default:
        return 'There was an error fetching your data.'
    }
  }

  return (
    <Modal isOpen onClose={() => {}}>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Error</ModalHeader>
        <ModalBody>{getErrorMessage()}</ModalBody>

        <ModalFooter>
          <Link to='/'>
            <Button variant='primary'>Go to home screen</Button>
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default FetchError
