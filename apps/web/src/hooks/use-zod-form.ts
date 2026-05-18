import { zodResolver } from '@hookform/resolvers/zod'
import {
  useForm,
  type FieldValues,
  type Resolver,
  type SubmitHandler,
  type UseFormProps,
} from 'react-hook-form'
import type { ZodType } from 'zod'

import { setApiFormErrors } from '@/lib/set-api-form-errors'

export function useZodForm<T extends FieldValues>(
  schema: ZodType<T, any, any>,
  options?: Omit<UseFormProps<T>, 'resolver'>,
) {
  const form = useForm<T>({
    ...options,
    resolver: zodResolver(schema as any) as Resolver<T>,
  })

  const handleApiSubmit = (onSubmit: SubmitHandler<T>) =>
    form.handleSubmit(async (values) => {
      try {
        await onSubmit(values)
      } catch (err) {
        setApiFormErrors(err, form.setError)
        throw err
      }
    })

  return { ...form, handleApiSubmit }
}
