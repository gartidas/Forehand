import { whiten, darken } from '@chakra-ui/theme-tools'

export const ButtonStyles = {
  // style object for base or default style
  baseStyle: {},

  // styles for different sizes ("sm", "md", "lg")
  sizes: {},

  // styles for different visual variants ("outline", "solid")
  variants: {
    primary: {
      bg: 'bg2',
      color: 'primary',
      _hover: {
        bg: darken('bg2', 5)
      }
    },
    primaryOutline: {
      bg: 'transparent',
      color: 'primary',
      border: '1px solid',
      borderColor: 'bg2',
      transition: 'all 200ms ease',
      _hover: {
        bg: darken('bg2', 5)
      }
    },

    secondary: {
      bg: 'secondary',
      color: 'primary',
      _hover: {
        bg: whiten('secondary', 20)
      }
    },
    secondaryOutline: {
      bg: 'transparent',
      color: 'primary',
      border: '1px solid',
      borderColor: 'secondary',
      transition: 'all 200ms ease',
      _hover: {
        bg: whiten('secondary', 20)
      }
    },
    warning: {
      bg: 'warning',
      color: 'primary',
      _hover: {
        bg: whiten('warning', 20)
      }
    },
    link: {
      color: 'primary'
    },
    ghost: {
      color: 'primary',
      _hover: {
        bg: 'bg2'
      }
    }
  },

  // default values for `size` and `variant`
  defaultProps: {}
}
