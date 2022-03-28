import { Box, Button, Flex, HStack, Spinner, Stack } from '@chakra-ui/react'
import { useNavigate } from 'react-router'
import { IApiError } from '../../../api/types'
import FormInput from '../../../components/elements/FormInput'
import Form from '../../../components/modules/HookForm/Form'
import { useSubmitForm } from '../../../components/modules/HookForm/hooks/useSubmitForm'
import { IUserExtended } from '../../../domainTypes'
import { errorToastIfNotValidationError, successToast } from '../../../services/toastService'
import { requiredValidator } from '../../../utils/validators'
import api from '../../../api/httpClient'
import { useQuery } from 'react-query'
import FetchError from '../../../components/elements/FetchError'
import { ChevronLeftIcon } from '@chakra-ui/icons'

interface IFormValue {
  givenName: string
  surname: string
  phoneNumber: string
}

interface UpdateBasicUserProps {
  id: string
}

const UpdateBasicUser = ({ id }: UpdateBasicUserProps) => {
  const navigate = useNavigate()

  const { data, isLoading, error, refetch } = useQuery<IUserExtended, IApiError>(
    ['users', id],
    async () => (await api.get(`/users/${id}`)).data
  )

  const { submitting, onSubmit } = useSubmitForm<IFormValue, string>({
    url: `/users/${id}/edit`,
    successCallback: () => {
      refetch()
      successToast('Profile updated successfully.')
      navigate(`/users/${id}`)
    },
    errorCallback: errorToastIfNotValidationError
  })

  if (error) return <FetchError error={error} />
  if (isLoading || !data) return <Spinner thickness='4px' color='primary' size='xl' mt='30px' />

  return (
    <Flex align={'center'} justify={'center'}>
      <Form onSubmit={onSubmit} defaultValues={data}>
        <Stack
          spacing={{ base: 4, md: 8 }}
          mx={'auto'}
          maxW={'lg'}
          py={{ base: 6, md: 12 }}
          px={{ base: 0, md: 6 }}
        >
          <Flex width='full' justifyContent='flex-end' alignItems='center' backgroundColor='bg2'>
            <Button variant='primary' onClick={() => navigate(`/users/${id}`)}>
              <ChevronLeftIcon />
            </Button>
          </Flex>
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
                    type='text'
                    name='surname'
                    label='Last Name'
                    isRequired
                    validate={requiredValidator}
                  />
                </Box>
              </HStack>
              <FormInput
                type='text'
                name='phoneNumber'
                label='Phone number'
                placeholder='+421-___-___-___'
                isRequired
                validate={requiredValidator}
              />
              <Stack spacing={{ base: 5, md: 10 }} pt={2}>
                <Button size='lg' variant='secondary' type='submit' isLoading={submitting}>
                  Update profile
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Form>
    </Flex>
  )
}

export default UpdateBasicUser
