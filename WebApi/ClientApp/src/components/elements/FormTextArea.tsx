import { FormControl, FormHelperText, FormLabel, Textarea, TextareaProps } from '@chakra-ui/react'
import { Controller, useFormContext } from 'react-hook-form'
import { Validator } from '../../domainTypes'

interface IFormTextAreaProps extends Omit<TextareaProps, 'value' | 'onChange'> {
  name: string
  label?: string
  placeholder?: string
  validate?: Validator<any>
}

const FormTextArea = ({
  name,
  label,
  placeholder,
  validate: initialValidate,
  isDisabled,
  isRequired,
  ...rest
}: IFormTextAreaProps) => {
  const form = useFormContext()
  const { errors } = form

  const validate = initialValidate ? (value: string) => initialValidate(value, form) : undefined

  const errorMessage = errors[name]?.message

  return (
    <Controller
      name={name}
      rules={{ validate }}
      render={({ value, ...innerRest }) => (
        <FormControl isRequired={isRequired}>
          <FormLabel mb={1}>{label}</FormLabel>

          <Textarea
            {...innerRest}
            {...rest}
            value={value || ''}
            isInvalid={!!errorMessage}
            isDisabled={isDisabled || form.formState.isSubmitting}
          />

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

export default FormTextArea
