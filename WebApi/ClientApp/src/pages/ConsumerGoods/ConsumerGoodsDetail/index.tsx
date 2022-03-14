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
import { IConsumerGoods } from '../../../domainTypes'
import { formatDateForInput } from '../../../utils'

interface ConsumerGoodsDetailProps {
  onClose: () => void
  refetch: () => void
  isOpen: boolean
  consumerGoods?: IConsumerGoods
}

interface IFormValue {
  price: number
  expirationDate: string
  productionDate: string
  name: string
  manufacturer: string
}

const defaultValues: Partial<IFormValue> = {
  price: 0,
  expirationDate: '',
  productionDate: '',
  name: '',
  manufacturer: ''
}

const ConsumerGoodsDetail = ({
  onClose,
  refetch,
  isOpen,
  consumerGoods
}: ConsumerGoodsDetailProps) => {
  const [isDisabled, setIsDisabled] = useState(true)
  const { submitting, onSubmit } = useSubmitForm<IFormValue, string>({
    url: consumerGoods ? `/consumer-goods/${consumerGoods.id}` : '/consumer-goods',
    method: consumerGoods ? 'patch' : 'post',
    successCallback: () => {
      successToast(consumerGoods ? 'Consumer goods edited.' : 'Consumer goods added.')
      refetch()
      onClose()
    },
    errorCallback: errorToastIfNotValidationError
  })

  const deleteConsumerGoods = async () => {
    try {
      await api.delete(`/consumer-goods/${consumerGoods!.id}`)
      successToast('Consumer goods deleted.')
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
        consumerGoods
          ? {
              price: consumerGoods.price,
              expirationDate: formatDateForInput(consumerGoods.expirationDate),
              productionDate: formatDateForInput(consumerGoods.productionDate),
              name: consumerGoods.name,
              manufacturer: consumerGoods.manufacturer
            }
          : defaultValues
      }
      title={consumerGoods ? consumerGoods.name : 'Add consumer goods'}
      footerButtons={
        consumerGoods
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
                  onClick: deleteConsumerGoods,
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
                  isDisabled={isDisabled && consumerGoods !== undefined}
                />
              </Box>
              <Box>
                <FormInput
                  type='number'
                  name='price'
                  label='Price'
                  isRequired
                  validate={combineValidators([requiredValidator, minNumericValue(0)])}
                  icon={<>€</>}
                  isDisabled={isDisabled && consumerGoods !== undefined}
                />
              </Box>
            </HStack>
            <HStack>
              <Box>
                <FormInput
                  type='date'
                  name='productionDate'
                  label='Production date'
                  isRequired
                  validate={requiredValidator}
                  isDisabled={isDisabled && consumerGoods !== undefined}
                />
              </Box>
              <Box>
                <FormInput
                  type='date'
                  name='expirationDate'
                  label='Expiration date'
                  isRequired
                  validate={requiredValidator}
                  isDisabled={isDisabled && consumerGoods !== undefined}
                />
              </Box>
            </HStack>
            <Box>
              <FormInput
                type='text'
                name='manufacturer'
                label='Manufacturer'
                isRequired
                validate={requiredValidator}
                isDisabled={isDisabled && consumerGoods !== undefined}
              />
            </Box>
          </Stack>
        </Stack>
      </Flex>
    </FormModal>
  )
}

export default ConsumerGoodsDetail
