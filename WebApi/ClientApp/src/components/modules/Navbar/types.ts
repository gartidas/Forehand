export interface INabButtonProps {
  label: string
  url: string
}

export const LoggedOutNavButtons: INabButtonProps[] = [
  { label: 'Home', url: '/' },
  { label: 'About', url: '/about' }
]
export const LoggedInNavButtons: INabButtonProps[] = [{ label: 'Home', url: '/home' }]
