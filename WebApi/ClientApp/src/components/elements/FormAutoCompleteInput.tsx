import { FormControl, FormHelperText, FormLabel } from '@chakra-ui/react'
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteInputProps
} from '@choc-ui/chakra-autocomplete'
import { Controller, useFormContext } from 'react-hook-form'
import { Validator } from '../../domainTypes'

interface IFormAutoCompleteInputProps extends Omit<AutoCompleteInputProps, 'value' | 'onChange'> {
  name: string
  label?: string
  placeholder?: string
  children?: JSX.Element
  onChangeFormatter?: (value: string) => any
  validate?: Validator<any>
}

const FormAutoCompleteInput = ({
  name,
  label,
  placeholder,
  isRequired,
  isDisabled,
  children,
  validate: initialValidate,
  onChangeFormatter = x => x,
  ...rest
}: IFormAutoCompleteInputProps) => {
  const form = useFormContext()
  const { errors } = form

  const validate = initialValidate ? (value: string) => initialValidate(value, form) : undefined

  const errorMessage = errors[name]?.message

  return (
    <Controller
      name={name}
      rules={{ validate }}
      render={({ onChange, ...innerRest }) => (
        <FormControl isRequired={isRequired} id={name}>
          <FormLabel mb={1}>{label}</FormLabel>

          <AutoComplete openOnFocus>
            <AutoCompleteInput
              {...rest}
              {...innerRest}
              isInvalid={!!errorMessage}
              onChange={x => onChange(onChangeFormatter(x.target.value))}
              isDisabled={isDisabled || form.formState.isSubmitting}
            />
            {{ ...children }}
          </AutoComplete>

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

export default FormAutoCompleteInput
