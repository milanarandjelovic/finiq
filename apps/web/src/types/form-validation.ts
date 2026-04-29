export type BackendValidationError = {
  property?: string
  messages?: string[]
}

export type MinimalFormError = {
  setError: (field: any, error: { message: string }) => void
}
