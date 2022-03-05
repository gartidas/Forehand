import { useState } from 'react'
import { UseFormMethods } from 'react-hook-form'
import { IApiError } from '../../../../api/types'
import api from '../../../../api/httpClient'
import { SubmitFormatter } from '../../../../domainTypes'

interface ISubmitFormParameters<TValues, TResponse> {
  url: string
  method?: 'post' | 'patch' | 'put' | 'delete'
  canSubmit?: boolean
  formatter?: SubmitFormatter<TValues>
  successCallback?: (data: TResponse, values: TValues, form: UseFormMethods<TValues>) => void
  errorCallback?: (error: IApiError['data'], form: UseFormMethods<TValues>) => void
}

export function useSubmitForm<TValues, TResponse = any>(
  params: ISubmitFormParameters<TValues, TResponse>
) {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const onSubmit = async (values: TValues, form: UseFormMethods<TValues>) => {
    const {
      url,
      canSubmit,
      method = 'post',
      formatter = x => x,
      successCallback,
      errorCallback
    } = params

    if (canSubmit === false) return

    setSubmitting(true)
    const data = formatter(values, form)
    const responsePromise =
      method === 'delete' ? api.delete(url, { params: data }) : api[method](url, data)

    try {
      const response = await responsePromise
      form.reset(form.getValues() as any, {
        isDirty: false,
        touched: false,
        dirtyFields: false,
        errors: true,
        isValid: true,
        isSubmitted: true,
        submitCount: true
      })
      setSuccess(true)
      successCallback?.(response.data, values, form)
    } catch (err) {
      const errors = (err as IApiError).data.errorDetails

      errors.forEach(x => {
        form.setError(x.propertyName as any, { message: x.message })
      })

      errorCallback?.((err as IApiError).data, form)
    }
    setSubmitting(false)
  }

  return { onSubmit, submitting, success }
}
