import { Prisma } from '@src/generated/prisma/client.js'
import { getRequestContext } from '@src/request-context.js'
import { WebCacheInvalidation } from '@src/web/cache/web-cache.invalidation.js'

const MUTATION_OPERATIONS = new Set<Prisma.PrismaAction>([
  'create',
  'createMany',
  'update',
  'updateMany',
  'updateManyAndReturn',
  'delete',
  'deleteMany',
  'upsert'
])

const MODEL_INVALIDATION_GROUP = {
  Post: 'posts',
  Category: 'posts',
  Project: 'projects',
  Technology: 'projects',
  Solution: 'projects',
  Page: 'pages',
  Setting: 'bootstrap'
} as const satisfies Partial<Record<Prisma.ModelName, keyof typeof WebCacheInvalidation>>

type InvalidationGroup = (typeof MODEL_INVALIDATION_GROUP)[keyof typeof MODEL_INVALIDATION_GROUP]

function invalidateModel(model: Prisma.ModelName | undefined, operation: Prisma.PrismaAction) {
  if (!model || !MUTATION_OPERATIONS.has(operation)) return

  const context = getRequestContext()

  if (context?.skipCacheInvalidation) return

  const group = MODEL_INVALIDATION_GROUP[model as keyof typeof MODEL_INVALIDATION_GROUP] as
    | InvalidationGroup
    | undefined

  if (!group) return

  WebCacheInvalidation[group]()
}

export const webCachePrismaExtension = Prisma.defineExtension({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const result = await query(args)

        invalidateModel(model, operation)

        return result
      }
    }
  }
})
