import { zodResolver } from '@hookform/resolvers/zod'
import {
  useForm,
  type FieldValues,
  type Resolver,
  type UseFormProps,
} from 'react-hook-form'
import type { ZodType } from 'zod'

/**
 * Thin wrapper around useForm that applies zodResolver and handles the
 * Resolver<T> cast required for Zod v4 compatibility.
 *
 * Always pass T explicitly: `useZodForm<MyFormValues>(schema, ...)`.
 * Zod v4 distinguishes input from output types, so inference picks the input
 * type (before transforms/defaults) rather than the output type you want.
 * The internal `as any` cast works around Zod v4's `_input: unknown`
 * mismatch with @hookform/resolvers' overloads.
 */
export function useZodForm<T extends FieldValues>(
  schema: ZodType<T, any, any>,
  options?: Omit<UseFormProps<T>, 'resolver'>,
) {
  return useForm<T>({
    ...options,
    resolver: zodResolver(schema as any) as Resolver<T>,
  })
}
