import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Box, Flex, HStack, Stack } from '@chakra-ui/react'
import { useState } from 'react'
import { IApiError } from '../../../api/types'
import api from '../../../api/httpClient'
import FormInput from '../../../components/elements/FormInput'
import FormTextArea from '../../../components/elements/FormTextArea'
import FormModal from '../../../components/modules/FormModal/FormModal'
import { useSubmitForm } from '../../../components/modules/HookForm/hooks/useSubmitForm'
import { ICourt } from '../../../domainTypes'
import {
  apiErrorToast,
  errorToastIfNotValidationError,
  successToast
} from '../../../services/toastService'
import { combineValidators, minNumericValue, requiredValidator } from '../../../utils/validators'

interface AddCourtModalProps {
  onClose: () => void
  refetch: () => void
  isOpen: boolean
  court?: ICourt
}

interface IFormValue {
  reservationPrice: number
  label: string
  description: string
}

const defaultValues: IFormValue = {
  reservationPrice: 0,
  label: '',
  description: ''
}

const CourtDetail = ({ onClose, refetch, isOpen, court }: AddCourtModalProps) => {
  const [isDisabled, setIsDisabled] = useState(true)

  const { submitting, onSubmit } = useSubmitForm<IFormValue, string>({
    url: court ? `/courts/${court.id}` : '/courts',
    method: court ? 'patch' : 'post',
    successCallback: () => {
      successToast(court ? 'Court edited.' : 'Court added.')
      refetch()
      onClose()
    },
    errorCallback: errorToastIfNotValidationError
  })

  const deleteCourt = async () => {
    try {
      await api.delete(`/courts/${court!.id}`)
      successToast('Court deleted.')
      refetch()
      onClose()
    } catch (err) {
      apiErrorToast(err as IApiError)
    }
  }

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      defaultValues={court ? court : defaultValues}
      title={court ? court.label : 'Add court'}
      footerButtons={
        court
          ? isDisabled
            ? [
                {
                  name: 'edit',
                  icon: <EditIcon />,
                  variant: 'secondary',
                  onClick: () => setIsDisabled(false),
                  shake: true
                },
                {
                  name: '',
                  icon: <DeleteIcon />,
                  variant: 'warning',
                  onClick: deleteCourt,
                  shake: true
                }
              ]
            : [
                {
                  name: 'submit',
                  onClick: () => {},
                  text: 'Submit',
                  variant: 'secondary',
                  type: 'submit',
                  isLoading: submitting
                },
                {
                  name: 'cancel',
                  onClick: () => setIsDisabled(true),
                  text: 'Cancel',
                  variant: 'primary'
                }
              ]
          : [
              {
                name: 'submit',
                onClick: () => {},
                text: 'Submit',
                variant: 'secondary',
                type: 'submit',
                isLoading: submitting
              }
            ]
      }
    >
      <Flex align={'center'} justify={'center'}>
        <Stack
          spacing={{ base: 4, md: 8 }}
          mx={'auto'}
          maxW={'lg'}
          py={{ base: 6, md: 12 }}
          px={{ base: 0, md: 6 }}
        >
          <Stack spacing={{ base: 2, md: 4 }}>
            <HStack>
              <Box>
                <FormInput
                  type='text'
                  name='label'
                  label='Label'
                  isRequired
                  validate={requiredValidator}
                  isDisabled={isDisabled && court !== undefined}
                />
              </Box>
              <Box>
                <FormInput
                  type='number'
                  name='reservationPrice'
                  label='Reservation price'
                  isRequired
                  validate={combineValidators([requiredValidator, minNumericValue(0)])}
                  icon={<>€/h</>}
                  isDisabled={isDisabled && court !== undefined}
                />
              </Box>
            </HStack>
            <FormTextArea
              name='description'
              label='Description'
              isDisabled={isDisabled && court !== undefined}
            />
          </Stack>
        </Stack>
      </Flex>
    </FormModal>
  )
}

export default CourtDetail
