export interface TextValue<T = string | number> {
  text: string | number
  value: T[keyof T]
}

export type FormModel<T> = {
  id: string
} & T

/**
 * Utility type for model input data (create and update operations) - excludes id, createdAt, and updatedAt fields
 */
export type ModelInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> & {
  published?: boolean
}
