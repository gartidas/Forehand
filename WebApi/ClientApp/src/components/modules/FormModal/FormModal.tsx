import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react'
import { ReactNode } from 'react'
import { UseFormMethods } from 'react-hook-form'
import Form from '../HookForm/Form'
import { WobblyDiv } from '../WobblyDiv/WobblyDiv'

interface FormModalProps {
  onClose: () => void
  onSubmit: (values: any, form: UseFormMethods<any>) => Promise<void>
  defaultValues: any
  isOpen: boolean
  children: ReactNode
  title?: string
  footerButtons?: {
    name: string
    variant: string
    text?: string
    onClick: () => void
    icon?: ReactNode
    type?: 'submit' | 'reset' | 'button' | undefined
    isLoading?: boolean
    shake?: boolean
  }[]
}

const FormModal = ({
  onClose,
  onSubmit,
  defaultValues,
  isOpen,
  children,
  title,
  footerButtons
}: FormModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <Form onSubmit={onSubmit} defaultValues={defaultValues}>
        <ModalContent>
          {title && <ModalHeader>{title}</ModalHeader>}
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>

          <ModalFooter>
            {footerButtons?.map(button => {
              return button.shake ? (
                <WobblyDiv key={button.name}>
                  <Button
                    key={button.name}
                    name={button.name}
                    variant={button.variant}
                    mr={3}
                    onClick={button.onClick}
                    type={button.type}
                    isLoading={button.isLoading}
                  >
                    {button.text}
                    {button.icon}
                  </Button>
                </WobblyDiv>
              ) : (
                <Button
                  key={button.name}
                  name={button.name}
                  variant={button.variant}
                  mr={3}
                  onClick={button.onClick}
                  type={button.type}
                  isLoading={button.isLoading}
                >
                  {button.text}
                  {button.icon}
                </Button>
              )
            })}
          </ModalFooter>
        </ModalContent>
      </Form>
    </Modal>
  )
}

export default FormModal
