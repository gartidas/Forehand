import { Button, Stack } from '@chakra-ui/react'
import { useState } from 'react'
import FormInput from '../../components/elements/FormInput'
import Form from '../../components/modules/HookForm/Form'
import { useSubmitForm } from '../../components/modules/HookForm/hooks/useSubmitForm'
import { errorToastIfNotValidationError, successToast } from '../../services/toastService'
import { combineValidators, minLengthValidator, requiredValidator } from '../../utils/validators'

interface IFormValue {
  currentPassword: string
  newPassword: string
}

const defaultValues: Partial<IFormValue> = {
  currentPassword: '',
  newPassword: ''
}

const ChangePassword = () => {
  const [key, setKey] = useState(false)
  const { submitting, onSubmit } = useSubmitForm<IFormValue, string>({
    url: '/auth/change-password',
    successCallback: () => {
      successToast('Password changed successfully.')
      setKey(!key)
    },
    errorCallback: errorToastIfNotValidationError
  })

  return (
    <Form key={key ? 'key' : 'notKey'} onSubmit={onSubmit} defaultValues={defaultValues}>
      <Stack
        w={'full'}
        maxW={'md'}
        spacing={{ base: 4, md: 8 }}
        rounded={'lg'}
        boxShadow={'lg'}
        p={{ base: 4, md: 8 }}
      >
        <FormInput
          type='password'
          name='currentPassword'
          label='Password'
          isRequired
          validate={requiredValidator}
        />
        <FormInput
          type='password'
          name='newPassword'
          label='New password'
          isRequired
          validate={combineValidators([requiredValidator, minLengthValidator(6)])}
        />

        <Stack spacing={{ base: 5, md: 10 }} pt={2}>
          <Button size='lg' variant='secondary' type='submit' isLoading={submitting}>
            Change password
          </Button>
        </Stack>
      </Stack>
    </Form>
  )
}

export default ChangePassword
