import { Box, useRadio, UseRadioProps } from '@chakra-ui/react'
import { ReactNode } from 'react'

type PaymentMethodRadioProps = UseRadioProps & {
  children?: ReactNode
  isDisabled: boolean
}

const PaymentMethodRadio = (props: PaymentMethodRadioProps) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as='label'>
      <input {...input} />
      <Box
        pointerEvents={props.isDisabled ? 'none' : 'all'}
        {...checkbox}
        cursor='pointer'
        borderRadius='md'
        boxShadow='md'
        _checked={{
          bg: 'secondary',
          color: 'bg'
        }}
        _hover={{
          bg: 'green.200'
        }}
        px={5}
        py={3}
        height='100%'
      >
        {props.children}
      </Box>
    </Box>
  )
}

export default PaymentMethodRadio
