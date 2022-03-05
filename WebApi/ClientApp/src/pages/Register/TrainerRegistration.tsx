import { Flex, Box, HStack, Stack, Button, Heading, Text, Link } from '@chakra-ui/react'
import FormInput from '../../components/elements/FormInput'
import Form from '../../components/modules/HookForm/Form'
import { useSubmitForm } from '../../components/modules/HookForm/hooks/useSubmitForm'
import { errorToastIfNotValidationError, successToast } from '../../services/toastService'
import {
  combineValidators,
  emailValidator,
  minLengthValidator,
  minNumericValue,
  requiredValidator
} from '../../utils/validators'
import FormTextArea from '../../components/elements/FormTextArea'
import { Role } from '../../domainTypes'
import { useNavigate } from 'react-router'

interface IFormValue {
  email: string
  password: string
  givenName: string
  surname: string
  role: number
  phoneNumber: string
  bio: string
  reservationPrice: number
}

const defaultValues: Partial<IFormValue> = {
  email: '',
  password: '',
  givenName: '',
  surname: '',
  phoneNumber: '',
  bio: '',
  reservationPrice: 0
}

const TrainerRegistration = () => {
  const navigate = useNavigate()
  const { submitting, onSubmit } = useSubmitForm<IFormValue, string>({
    url: '/auth/register',
    formatter: values => ({ ...values, role: Role.Trainer }),
    successCallback: () => {
      successToast('Registered successfully.')
      navigate('/login')
    },
    errorCallback: errorToastIfNotValidationError
  })

  return (
    <Flex align={'center'} justify={'center'}>
      <Form onSubmit={onSubmit} defaultValues={defaultValues}>
        <Stack
          spacing={{ base: 4, md: 8 }}
          mx={'auto'}
          maxW={'lg'}
          py={{ base: 6, md: 12 }}
          px={{ base: 0, md: 6 }}
        >
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Sign up
            </Heading>
            <Text fontSize={'lg'} color='primary'>
              to enjoy all of our cool features ✌️
            </Text>
          </Stack>
          <Box rounded={'lg'} boxShadow={'lg'} p={{ base: 4, md: 8 }}>
            <Stack spacing={{ base: 2, md: 4 }}>
              <HStack>
                <Box>
                  <FormInput
                    type='text'
                    name='givenName'
                    label='First Name'
                    isRequired
                    validate={requiredValidator}
                  />
                </Box>
                <Box>
                  <FormInput
                    name='surname'
                    label='Last Name'
                    isRequired
                    validate={requiredValidator}
                  />
                </Box>
              </HStack>
              <FormTextArea name='bio' label='Bio' isRequired validate={requiredValidator} />
              <FormInput
                type='number'
                name='reservationPrice'
                label='Reservation price'
                isRequired
                validate={combineValidators([requiredValidator, minNumericValue(0)])}
              />
              <FormInput
                type='text'
                name='phoneNumber'
                label='Phone number'
                placeholder='+421-___-___-___'
                isRequired
                validate={requiredValidator}
              />
              <FormInput
                type='text'
                name='email'
                label='Email address'
                isRequired
                validate={combineValidators([requiredValidator, emailValidator])}
              />
              <FormInput
                type='password'
                name='password'
                label='Password'
                isRequired
                validate={combineValidators([requiredValidator, minLengthValidator(6)])}
              />
              <Stack spacing={{ base: 5, md: 10 }} pt={2}>
                <Button size='lg' variant='secondary' type='submit' isLoading={submitting}>
                  Sign up
                </Button>
              </Stack>
              <Stack pt={{ base: 3, md: 6 }}>
                <Link color='secondary' href='/login' textAlign='center'>
                  Already a user?
                </Link>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Form>
    </Flex>
  )
}

export default TrainerRegistration
