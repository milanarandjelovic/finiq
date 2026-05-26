import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'

interface ApiValidationError {
  property: string
  messages: string[]
}

export function setApiFormErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): boolean {
  if (
    typeof error !== 'object' ||
    error === null ||
    !('errors' in error) ||
    !Array.isArray((error as { errors?: unknown }).errors)
  ) {
    return false
  }

  const errors = (error as { errors: ApiValidationError[] }).errors

  for (const { property, messages } of errors) {
    if (property && messages[0]) {
      setError(property as Path<T>, { message: messages[0] })
    }
  }

  return errors.length > 0
}
