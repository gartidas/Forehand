import { Box } from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/spinner'
import { Role } from '../../domainTypes'
import { useAuth } from '../../contextProviders/AuthProvider'

interface IProtectedRouteProps {
  children: JSX.Element
  roles?: Role[]
}

const ProtectedRoute = ({ children, roles }: IProtectedRouteProps) => {
  const auth = useAuth()

  if (auth.isLoading && !auth.isLoggedIn)
    return (
      <Box h='100vh' d='grid' placeItems='center'>
        <Spinner thickness='4px' speed='0.65s' color='primary' size='xl' />
      </Box>
    )

  if (!auth.isLoggedIn) {
    const { href, origin } = window.location
    const path = href.replace(origin, '')
    window.location.replace(`/login?redirectedFrom=${path}`)
    return <></>
  }

  const hasRequiredRole = roles ? auth.isLoggedIn && roles.includes(auth.currentUser.role) : true

  if (!hasRequiredRole) {
    window.location.replace(`/`)
    return <></>
  }

  return children
}

export default ProtectedRoute
