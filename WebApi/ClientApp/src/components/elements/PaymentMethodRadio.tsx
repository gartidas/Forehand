import { Box, useRadio, UseRadioProps } from '@chakra-ui/react'
import { ReactNode } from 'react'

type PaymentMethodRadioProps = UseRadioProps & {
  children?: ReactNode
}

const PaymentMethodRadio = (props: PaymentMethodRadioProps) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as='label'>
      <input {...input} />
      <Box
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
      >
        {props.children}
      </Box>
    </Box>
  )
}

export default PaymentMethodRadio
