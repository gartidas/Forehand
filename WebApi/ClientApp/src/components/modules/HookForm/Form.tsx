import { isFunction } from 'lodash'
import { ReactNode, useEffect } from 'react'
import {
  useForm,
  FormProvider,
  UseFormMethods,
  DefaultValues,
  SubmitHandler
} from 'react-hook-form'

export interface IFormProps<T> {
  debug?: boolean
  children: ReactNode | ((form: UseFormMethods<T>) => ReactNode)
  defaultValues: DefaultValues<T>
  onSubmit: (values: T, form: UseFormMethods<T>) => Promise<void>
}

export default function Form<T>({
  defaultValues,
  children,
  debug,
  onSubmit: initialOnSubmit
}: IFormProps<T>) {
  const form = useForm<T>({
    mode: 'onTouched',
    defaultValues
  })

  const formValues = form.watch()
  useEffect(() => {
    if (debug) console.log('FORM VALUES:', formValues)
  }, [formValues, debug])

  //Note: Fixes form still dirty when typing in same value as initial
  useEffect(() => {
    form.reset(form.getValues() as any)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async (values: T) => {
    await initialOnSubmit(values, form)
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as SubmitHandler<T>)}>
        {isFunction(children) ? children(form) : children}
      </form>
    </FormProvider>
  )
}
