import { Box } from '@chakra-ui/react'
import DefaultLayout from '../../components/layouts/DefaultLayout'
import LoginForm from './LoginForm'

export default function Login() {
  return (
    <Box overflowX='hidden'>
      <DefaultLayout>
        <LoginForm />
      </DefaultLayout>
    </Box>
  )
}
