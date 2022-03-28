import { useParams } from 'react-router'
import { useAuthorizedUser } from '../../../contextProviders/AuthProvider'
import { Role } from '../../../domainTypes'
import UpdateBasicUser from './UpdateBasicUser'
import UpdateTrainer from './UpdateTrainer'

const UpdateUser = () => {
  const { id } = useParams<{ id: string }>()

  const { currentUser } = useAuthorizedUser()
  return (
    <>
      {currentUser.role === Role.Trainer ? (
        <UpdateTrainer id={id!} />
      ) : (
        <UpdateBasicUser id={id!} />
      )}
    </>
  )
}

export default UpdateUser
