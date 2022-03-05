import { Box } from '@chakra-ui/react'
import DefaultLayout from '../../components/layouts/DefaultLayout'
import RegisterForm from './RegisterForm'

export default function Register() {
  return (
    <Box overflowX='hidden'>
      <DefaultLayout>
        <RegisterForm />
      </DefaultLayout>
    </Box>
  )
}
