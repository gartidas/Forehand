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
import { ISportsGear, PhysicalState } from '../../../domainTypes'
import FormSelect from '../../../components/elements/FormSelect'
import { formatDateForInput } from '../../../utils'

interface SportsGearDetailProps {
  onClose: () => void
  refetch: () => void
  isOpen: boolean
  sportsGear?: ISportsGear
}

interface IFormValue {
  reservationPrice: number
  registrationNumber: string
  shoppingPrice: number
  name: string
  productionYear: string
  physicalState: number
  manufacturer: string
}

const defaultValues: Partial<IFormValue> = {
  reservationPrice: 0,
  registrationNumber: '',
  shoppingPrice: 0,
  name: '',
  physicalState: PhysicalState.New,
  manufacturer: ''
}

const SportsGearDetail = ({ onClose, refetch, isOpen, sportsGear }: SportsGearDetailProps) => {
  const [isDisabled, setIsDisabled] = useState(true)
  const { submitting, onSubmit } = useSubmitForm<IFormValue, string>({
    url: sportsGear ? `/sports-gear/${sportsGear.id}` : '/sports-gear',
    method: sportsGear ? 'patch' : 'post',
    successCallback: () => {
      successToast(sportsGear ? 'Sports gear edited.' : 'Sports gear added.')
      refetch()
      onClose()
    },
    errorCallback: errorToastIfNotValidationError
  })

  const deleteSportsGear = async () => {
    try {
      await api.delete(`/sports-gear/${sportsGear!.id}`)
      successToast('Sports gear deleted.')
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
        sportsGear
          ? {
              reservationPrice: sportsGear.reservationPrice,
              registrationNumber: sportsGear.registrationNumber,
              shoppingPrice: sportsGear.shoppingPrice,
              name: sportsGear.name,
              productionYear: formatDateForInput(sportsGear.productionYear),
              physicalState: sportsGear.physicalState,
              manufacturer: sportsGear.manufacturer
            }
          : defaultValues
      }
      title={sportsGear ? sportsGear.registrationNumber : 'Add sports gear'}
      footerButtons={
        sportsGear
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
                  onClick: deleteSportsGear,
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
                  isDisabled={isDisabled && sportsGear !== undefined}
                />
              </Box>
              <Box>
                <FormInput
                  type='text'
                  name='registrationNumber'
                  label='Registration number'
                  isRequired
                  validate={requiredValidator}
                  isDisabled={isDisabled && sportsGear !== undefined}
                />
              </Box>
            </HStack>
            <HStack>
              <Box>
                <FormInput
                  type='number'
                  name='reservationPrice'
                  label='Reservation price'
                  isRequired
                  validate={combineValidators([requiredValidator, minNumericValue(0)])}
                  icon={<>€/h</>}
                  isDisabled={isDisabled && sportsGear !== undefined}
                />
              </Box>
              <Box>
                <FormInput
                  type='number'
                  name='shoppingPrice'
                  label='Shopping price'
                  isRequired
                  validate={combineValidators([requiredValidator, minNumericValue(0)])}
                  icon={<>€/h</>}
                  isDisabled={isDisabled && sportsGear !== undefined}
                />
              </Box>
            </HStack>
            <HStack>
              <Box>
                <FormInput
                  type='date'
                  name='productionYear'
                  label='Production year'
                  isRequired
                  validate={requiredValidator}
                  isDisabled={isDisabled && sportsGear !== undefined}
                />
              </Box>
              <Box>
                <FormInput
                  type='text'
                  name='manufacturer'
                  label='Manufacturer'
                  isRequired
                  validate={requiredValidator}
                  isDisabled={isDisabled && sportsGear !== undefined}
                />
              </Box>
            </HStack>
            <FormSelect
              name='physicalState'
              label='Physical state'
              isRequired
              validate={requiredValidator}
              onChangeFormatter={value => +value}
              isDisabled={isDisabled && sportsGear !== undefined}
            >
              <option value={PhysicalState.New}>{PhysicalState[1]}</option>
              <option value={PhysicalState.Used}>{PhysicalState[2]}</option>
              <option value={PhysicalState.WornOut}>{PhysicalState[3]}</option>
              <option value={PhysicalState.Damaged}>{PhysicalState[4]}</option>
              <option value={PhysicalState.Discarded}>{PhysicalState[5]}</option>
            </FormSelect>
          </Stack>
        </Stack>
      </Flex>
    </FormModal>
  )
}

export default SportsGearDetail
