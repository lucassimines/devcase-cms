import { PrismaPg } from '@prisma/adapter-pg'
import type { WhereScopedOperation } from '@src/types/prisma.js'
import { webCachePrismaExtension } from '@src/web/cache/web-cache.prisma-hook.js'
import { Prisma, PrismaClient } from './generated/prisma/client.js'
import { getRequestContext } from './request-context.js'

const connectionString = process.env.DATABASE_URL!

const adapter = new PrismaPg({ connectionString })
const prismaRaw = new PrismaClient({ adapter })

/* ---------------------------------- */
/* Scoped configuration */
/* ---------------------------------- */

const SCOPED_MODELS: ReadonlySet<Prisma.ModelName> = new Set([])

const WHERE_SCOPED_OPERATIONS: ReadonlySet<WhereScopedOperation> = new Set<WhereScopedOperation>([
  'findMany',
  'findFirst',
  'findFirstOrThrow',
  'count',
  'aggregate',
  'groupBy',
  'updateMany',
  'updateManyAndReturn',
  'deleteMany'
])

/* ---------------------------------- */
/* Helpers */
/* ---------------------------------- */

function addUserIdToWhere<T extends object>(
  where: T | undefined,
  userId: string
): Prisma.InputJsonObject {
  if (where && typeof where === 'object') {
    return { AND: [where, { userId }] }
  }

  return { userId }
}

function addUserIdToCreateData<T>(data: T, userId: string): T {
  if (!data) return data

  // createMany only accepts scalar fields
  if (Array.isArray(data)) {
    return data.map((item) => ({
      ...item,
      userId
    })) as T
  }

  // create accepts relation-style input
  if (typeof data === 'object') {
    return {
      ...data,
      user: { connect: { id: userId } }
    }
  }

  return data
}

/* ---------------------------------- */
/* Prisma extension */
/* ---------------------------------- */

const prismaScoped = prismaRaw.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const context = getRequestContext()

        if (!context?.userId || context.skipScope || !model || !SCOPED_MODELS.has(model)) {
          return query(args)
        }

        const scopedArgs = (args ?? {}) as {
          where?: Record<string, unknown>
          data?: unknown
        }

        /* ---------- CREATE ---------- */

        if (operation === 'create' || operation === 'createMany') {
          scopedArgs.data = addUserIdToCreateData(scopedArgs.data, context.userId)

          return query(scopedArgs as typeof args)
        }

        /* ---------- WHERE OPERATIONS ---------- */

        if (WHERE_SCOPED_OPERATIONS.has(operation as WhereScopedOperation)) {
          scopedArgs.where = addUserIdToWhere(scopedArgs.where, context.userId)

          return query(scopedArgs as typeof args)
        }

        return query(args)
      }
    }
  }
})

const prisma = prismaScoped.$extends(webCachePrismaExtension)

export { prisma, prismaRaw }
