import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Box, Flex, HStack, Stack } from '@chakra-ui/react'
import { useState } from 'react'
import { IApiError } from '../../../api/types'
import api from '../../../api/httpClient'
import FormInput from '../../../components/elements/FormInput'
import FormModal from '../../../components/modules/FormModal/FormModal'
import { useSubmitForm } from '../../../components/modules/HookForm/hooks/useSubmitForm'
import {
  apiErrorToast,
  errorToastIfNotValidationError,
  successToast
} from '../../../services/toastService'
import { combineValidators, minNumericValue, requiredValidator } from '../../../utils/validators'
import { IGiftCard } from '../../../domainTypes'

interface GiftCardDetailProps {
  onClose: () => void
  refetch: () => void
  isOpen: boolean
  giftCard?: IGiftCard
}

interface IFormValue {
  value: number
  price: number
  name: string
  code: string
}

const defaultValues: Partial<IFormValue> = {
  value: 0,
  price: 0,
  name: '',
  code: ''
}

const GiftCardDetail = ({ onClose, refetch, isOpen, giftCard }: GiftCardDetailProps) => {
  const [isDisabled, setIsDisabled] = useState(true)
  const { submitting, onSubmit } = useSubmitForm<IFormValue, string>({
    url: giftCard ? `/gift-cards/${giftCard.id}` : '/gift-cards',
    method: giftCard ? 'patch' : 'post',
    successCallback: () => {
      successToast(giftCard ? 'Gift card edited.' : 'Gift card added.')
      refetch()
      onClose()
    },
    errorCallback: errorToastIfNotValidationError
  })

  const deleteGiftCard = async () => {
    try {
      await api.delete(`/gift-cards/${giftCard!.id}`)
      successToast('Gift card deleted.')
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
      defaultValues={
        giftCard
          ? {
              value: giftCard.value,
              price: giftCard.price,
              name: giftCard.name,
              code: giftCard.code
            }
          : defaultValues
      }
      title={giftCard ? giftCard.name : 'Add gift card'}
      footerButtons={
        giftCard
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
                  onClick: deleteGiftCard,
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
                  name='name'
                  label='Name'
                  isRequired
                  validate={requiredValidator}
                  isDisabled={isDisabled && giftCard !== undefined}
                />
              </Box>
              <Box>
                <FormInput
                  type='text'
                  name='code'
                  label='Code'
                  isRequired
                  validate={requiredValidator}
                  isDisabled={isDisabled && giftCard !== undefined}
                />
              </Box>
            </HStack>
            <HStack>
              <Box>
                <FormInput
                  type='number'
                  name='price'
                  label='Price'
                  isRequired
                  validate={combineValidators([requiredValidator, minNumericValue(0)])}
                  icon={<>€/h</>}
                  isDisabled={isDisabled && giftCard !== undefined}
                />
              </Box>
              <Box>
                <FormInput
                  type='number'
                  name='value'
                  label='Value'
                  isRequired
                  validate={combineValidators([requiredValidator, minNumericValue(0)])}
                  icon={<>€/h</>}
                  isDisabled={isDisabled && giftCard !== undefined}
                />
              </Box>
            </HStack>
          </Stack>
        </Stack>
      </Flex>
    </FormModal>
  )
}

export default GiftCardDetail
