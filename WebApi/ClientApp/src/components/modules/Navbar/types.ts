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
export const EmployeeNavButtons: INabButtonProps[] = [{ label: 'Home', url: '/home' }]
export const TrainerNavButtons: INabButtonProps[] = [{ label: 'Home', url: '/home' }]
export const AdminNavButtons: INabButtonProps[] = [
  { label: 'Home', url: '/home' },
  { label: 'Users', url: '/admin' }
]
export const NoneNavButtons: INabButtonProps[] = []

export const LoggedInNavButtons = {
  [Role.BasicUser]: CustomerNavButtons,
  [Role.Employee]: EmployeeNavButtons,
  [Role.Trainer]: TrainerNavButtons,
  [Role.Admin]: AdminNavButtons,
  [Role.None]: NoneNavButtons
}
