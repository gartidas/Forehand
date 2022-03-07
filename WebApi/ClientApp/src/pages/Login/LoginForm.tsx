import { Button, Flex, Heading, Link, Stack } from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import FormInput from '../../components/elements/FormInput'
import Form, { IFormProps } from '../../components/modules/HookForm/Form'
import { NAVBAR_HEIGHT } from '../../components/modules/Navbar/Navbar'
import { useAuth } from '../../contextProviders/AuthProvider'
import { login } from '../../services/authService'
import { getApiErrorMessage } from '../../utils'
import { requiredValidator } from '../../utils/validators'

interface IFormValue {
  email: string
  password: string
}

const defaultValues: IFormValue = {
  email: 'admin@forehand.com',
  password: 'admin123'
}

const LoginForm = () => {
  const navigate = useNavigate()
  const { fetchUser } = useAuth()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit: IFormProps<IFormValue>['onSubmit'] = async (values, { setError }) => {
    setSubmitting(true)
    const successOrError = await login(values)

    if (successOrError !== true) {
      setSubmitting(false)
      return setError('email', { message: getApiErrorMessage(successOrError) })
    }

    await fetchUser()
    navigate('/home', { replace: true })
  }

  return (
    <Stack height={`calc(100vh - ${NAVBAR_HEIGHT})`} display='flex' justifyContent='center'>
      <Form onSubmit={handleSubmit} defaultValues={defaultValues}>
        <Flex p={8} flex={1} align={'center'} justify={'center'}>
          <Stack spacing={4} w={'full'} maxW={'md'}>
            <Heading fontSize={'2xl'}>Sign in to your account</Heading>
            <FormInput
              name='email'
              label='Email address'
              type='email'
              isRequired
              validate={requiredValidator}
            />
            <FormInput
              name='password'
              label='Password'
              type='password'
              isRequired
              validate={requiredValidator}
            />
            <Stack spacing={6}>
              <Link color='secondary' href='/register'>
                Don't have a account?
              </Link>
              <Button variant='secondary' type='submit' isLoading={submitting}>
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Flex>
      </Form>
    </Stack>
  )
}

export default LoginForm
