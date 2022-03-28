import { useParams } from 'react-router'
import api from '../../../api/httpClient'
import { IApiError } from '../../../api/types'
import { ISubscriptionCard, IUserExtended, Role } from '../../../domainTypes'
import { useQuery } from 'react-query'
import FetchError from '../../../components/elements/FetchError'
import { Avatar, Box, Center, Divider, Flex, Heading, Spinner, Stack, Text } from '@chakra-ui/react'
import roleColors from '../../../styles/roleColors'
import { NAVBAR_HEIGHT } from '../../../components/modules/Navbar/Navbar'
import Rating from 'react-rating'
import { StarIcon } from '@chakra-ui/icons'
import { apiErrorToast, successToast } from '../../../services/toastService'
import { useAuthorizedUser } from '../../../contextProviders/AuthProvider'
import SubscriptionCardBadge from '../../../components/elements/SubscriptionCardBadge'
import { fetchSubscriptionCard } from '../../../services/authService'
import { useState } from 'react'

const UserDetail = () => {
  const [subscriptionCard, setSubscriptionCard] = useState<ISubscriptionCard>()
  const { currentUser } = useAuthorizedUser()
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, error, refetch } = useQuery<IUserExtended, IApiError>(
    ['users', id],
    async () => (await api.get(`/users/${id}`)).data,
    { onSuccess: async result => setSubscriptionCard(await fetchSubscriptionCard(result.id)) }
  )

  if (error) return <FetchError error={error} />
  if (isLoading || !data) return <Spinner thickness='4px' color='primary' size='xl' mt='30px' />

  const handleStatusChanged = async (rating: number) => {
    try {
      await api.patch(`/users/${data.id}/add-rating`, {
        rating: rating
      })
    } catch (err) {
      apiErrorToast(err as IApiError)
      refetch()
      return
    }
    successToast('Rating added.')
    refetch()
  }

  return (
    <Center minHeight={`calc(100vh - ${NAVBAR_HEIGHT})`}>
      <Box
        maxW={'350px'}
        w={'full'}
        bg={'bg'}
        rounded={'lg'}
        boxShadow={'lg'}
        overflow={'hidden'}
        position='relative'
      >
        <Box h={'120px'} w={'full'} backgroundColor={roleColors[data.role]} />
        <Flex justify={'center'} mt={-12}>
          <Avatar
            size={'xl'}
            src={`https://avatars.dicebear.com/api/adventurer-neutral/${data.id}.svg`}
            marginRight={2}
            border={`2px solid ${roleColors[data.role]}`}
          />
        </Flex>

        <SubscriptionCardBadge subscriptionCard={subscriptionCard} />

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
                    <Flex>
                      <Rating
                        initialRating={data.rating}
                        readonly={
                          currentUser.role !== Role.BasicUser || data.hasCurrentUserRatedUser
                        }
                        onChange={value => handleStatusChanged(value)}
                        emptySymbol={<StarIcon color='primary' />}
                        fullSymbol={<StarIcon color='secondary' />}
                      />
                      <Text fontWeight={600} marginLeft={1} paddingTop={0.5}>
                        {`(${data.numberOfRatings})`}
                      </Text>
                    </Flex>
                  </Stack>
                  <Stack spacing={0} align={'center'}>
                    <Text fontSize={'sm'} color={'tertiary'}>
                      Price
                    </Text>
                    <Text fontWeight={600}>{`${data.reservationPrice} €/h`}</Text>
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
