export type PrismaDelegate = {
  findMany: (args?: any) => Promise<any[]>
  findUnique: (args?: any) => Promise<any>
  findFirst: (args?: any) => Promise<any>
  count: (args?: any) => Promise<any>
  update: (args?: any) => Promise<any>
}

export type PrismaFindManyArgs = {
  where?: any
  orderBy?: any
  skip?: number
  take?: number
  include?: any
}

export type WhereScopedOperation =
  | 'findMany'
  | 'findFirst'
  | 'findFirstOrThrow'
  | 'count'
  | 'aggregate'
  | 'groupBy'
  | 'updateMany'
  | 'updateManyAndReturn'
  | 'deleteMany'
