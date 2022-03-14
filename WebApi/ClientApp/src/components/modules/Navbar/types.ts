import { Role } from '../../../domainTypes'

export interface INabButtonProps {
  label: string
  url: string
}

export const LoggedOutNavButtons: INabButtonProps[] = [
  { label: 'Home', url: '/' },
  { label: 'About', url: '/about' }
]

export const CustomerNavButtons: INabButtonProps[] = [{ label: 'Home', url: '/home' }]
export const EmployeeNavButtons: INabButtonProps[] = [
  { label: 'Home', url: '/home' },
  { label: 'Courts', url: '/courts' },
  { label: 'Sports gear', url: '/sports-gear' },
  { label: 'Gift cards', url: '/gift-cards' },
  { label: 'Consumer goods', url: '/consumer-goods' }
]
export const TrainerNavButtons: INabButtonProps[] = [{ label: 'Home', url: '/home' }]
export const AdminNavButtons: INabButtonProps[] = [
  { label: 'Home', url: '/home' },
  { label: 'Users', url: '/users' },
  { label: 'Courts', url: '/courts' },
  { label: 'Sports gear', url: '/sports-gear' },
  { label: 'Gift cards', url: '/gift-cards' },
  { label: 'Consumer goods', url: '/consumer-goods' }
]
export const NoneNavButtons: INabButtonProps[] = []

export const LoggedInNavButtons = {
  [Role.BasicUser]: CustomerNavButtons,
  [Role.Employee]: EmployeeNavButtons,
  [Role.Trainer]: TrainerNavButtons,
  [Role.Admin]: AdminNavButtons,
  [Role.None]: NoneNavButtons
}
