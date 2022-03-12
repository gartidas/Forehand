import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { Input, InputProps, InputRightElement, InputGroup } from '@chakra-ui/input'
import { FormControl, FormLabel, FormHelperText, Button } from '@chakra-ui/react'
import { ReactNode, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Validator } from '../../domainTypes'

interface IFormInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  name: string
  label?: string
  type?: string
  placeholder?: string
  icon?: ReactNode
  validate?: Validator<any>
}

const FormInput = ({
  name,
  isDisabled,
  label,
  isRequired,
  type,
  icon,
  validate: initialValidate,
  ...rest
}: IFormInputProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const form = useFormContext()
  const { errors } = form

  const validate = initialValidate ? (value: string) => initialValidate(value, form) : undefined

  const getParsingOnChangeFunction =
    (onChange: (x: any) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (type === 'number') return onChange(value || value === '0' ? Number(value) : value)
      return onChange(value)
    }

  const handleBlur = (value: any, onChange: any, onBlur: any) => {
    if (type === 'number') {
      onChange(Number(value))
    }
    onBlur()
  }

  const errorMessage = errors[name]?.message

  return (
    <Controller
      name={name}
      rules={{ validate }}
      render={({ onChange, value, onBlur, ...innerRest }) => (
        <FormControl isRequired={isRequired}>
          <FormLabel mb={1}>{label}</FormLabel>
          {type === 'password' ? (
            <InputGroup>
              <Input
                {...innerRest}
                {...rest}
                value={value ?? ''}
                isInvalid={!!errorMessage}
                onBlur={() => handleBlur(value, onChange, onBlur)}
                onChange={getParsingOnChangeFunction(onChange)}
                isDisabled={isDisabled || form.formState.isSubmitting}
                type={showPassword ? 'text' : 'password'}
              />
              <InputRightElement h={'full'}>
                <Button
                  variant={'ghost'}
                  onClick={() => setShowPassword(showPassword => !showPassword)}
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          ) : (
            <InputGroup>
              <Input
                {...innerRest}
                {...rest}
                value={value ?? ''}
                isInvalid={!!errorMessage}
                type={type}
                onBlur={() => handleBlur(value, onChange, onBlur)}
                onChange={getParsingOnChangeFunction(onChange)}
                isDisabled={isDisabled || form.formState.isSubmitting}
              />
              {icon && <InputRightElement h={'full'}>{icon}</InputRightElement>}
            </InputGroup>
          )}
          {errorMessage && (
            <FormHelperText mt={0} color='red'>
              {errorMessage}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  )
}

export default FormInput
