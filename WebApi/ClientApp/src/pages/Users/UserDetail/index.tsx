import { useParams } from 'react-router'
import api from '../../../api/httpClient'
import { IApiError } from '../../../api/types'
import { IUserExtended, Role } from '../../../domainTypes'
import { useQuery } from 'react-query'
import FetchError from '../../../components/elements/FetchError'
import { Avatar, Box, Center, Divider, Flex, Heading, Spinner, Stack, Text } from '@chakra-ui/react'
import roleColors from '../../../styles/roleColors'
import { NAVBAR_HEIGHT } from '../../../components/modules/Navbar/Navbar'

const UserDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, error } = useQuery<IUserExtended, IApiError>(
    ['users', id],
    async () => (await api.get(`/users/${id}`)).data
  )

  if (error) return <FetchError error={error} />
  if (isLoading || !data) return <Spinner thickness='4px' color='primary' size='xl' mt='30px' />

  return (
    <Center py={6} height={`calc(100vh - ${NAVBAR_HEIGHT})`}>
      <Box maxW={'350px'} w={'full'} bg={'bg'} rounded={'lg'} boxShadow={'lg'} overflow={'hidden'}>
        <Box h={'120px'} w={'full'} backgroundColor={roleColors[data.role]} />
        <Flex justify={'center'} mt={-12}>
          <Avatar
            size={'xl'}
            src={`https://avatars.dicebear.com/api/adventurer-neutral/${data.id}.svg`}
            marginRight={2}
            border={`2px solid ${roleColors[data.role]}`}
          />
        </Flex>

        <Box p={6}>
          <Stack spacing={0} align={'center'} mb={5}>
            <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
              {data.givenName} {data.surname}
            </Heading>
            <Text color={'tertiary'}>{data.email}</Text>
            <Text color={'tertiary'}>{data.phoneNumber ? data.phoneNumber : <br />}</Text>
          </Stack>
          {data.role === Role.Trainer && (
            <>
              <Divider borderColor='tertiary' />
              <Stack align={'center'}>
                <Stack mb={3} mt={5} width='full'>
                  <Text fontWeight={600} width='full'>
                    Bio
                  </Text>
                  <Text width='full'>{data.bio ? data.bio : <br />}</Text>
                </Stack>
                <Divider borderColor='tertiary' />
                <Stack direction={'row'} justify={'center'} spacing={20}>
                  <Stack spacing={0} align={'center'}>
                    <Text fontSize={'sm'} color={'tertiary'}>
                      Rating
                    </Text>
                    <Text fontWeight={600}>{data.rating} / 5</Text>
                  </Stack>
                  <Stack spacing={0} align={'center'}>
                    <Text fontSize={'sm'} color={'tertiary'}>
                      Price
                    </Text>
                    <Text fontWeight={600}>
                      {data.reservationPrice ? `${data.reservationPrice}€` : <br />}
                    </Text>
                  </Stack>
                </Stack>
              </Stack>
            </>
          )}
        </Box>
      </Box>
    </Center>
  )
}

export default UserDetail
