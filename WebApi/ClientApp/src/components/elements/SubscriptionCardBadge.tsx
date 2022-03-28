import { Badge, Box } from '@chakra-ui/react'
import { ISubscriptionCard, SubscriptionType } from '../../domainTypes'
import subscriptionTypeColors from '../../styles/subscriptionTypeColors'

interface SubscriptionCardBadgeProps {
  subscriptionCard?: ISubscriptionCard
}

const SubscriptionCardBadge = ({ subscriptionCard }: SubscriptionCardBadgeProps) => {
  return (
    <Box position='absolute' top={2} right={2} boxShadow={'lg'}>
      {subscriptionCard ? (
        <Badge backgroundColor={subscriptionTypeColors[subscriptionCard.subscriptionType]}>
          {SubscriptionType[subscriptionCard.subscriptionType]}
        </Badge>
      ) : (
        <></>
      )}
    </Box>
  )
}

export default SubscriptionCardBadge
