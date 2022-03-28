import { SubscriptionType } from '../domainTypes'

const subscriptionTypeColors = {
  [SubscriptionType.Unknown]: 'white',
  [SubscriptionType.Basic]: '#76E4F7',
  [SubscriptionType.Silver]: '#C0C0C0',
  [SubscriptionType.Gold]: '#FFD700'
}

export default subscriptionTypeColors
