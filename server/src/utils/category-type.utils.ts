import { CategoryType } from '@src/generated/prisma/client.js'

const TYPE_PARAM_TO_ENUM: Record<string, CategoryType> = {
  post: CategoryType.POST
}

export function parseCategoryTypeParam(param: string): CategoryType {
  const type = TYPE_PARAM_TO_ENUM[param.toLowerCase()]

  if (!type) {
    throw new Error(`Invalid category type: ${param}`)
  }

  return type
}

export function categoryTypeToParam(type: CategoryType): string {
  return type.toLowerCase()
}
