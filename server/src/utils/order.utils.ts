import { prisma } from '@src/db.js'
import type {
  CategoryCreateInput,
  PageCreateInput,
  PostCreateInput,
  ProjectCreateInput,
  SolutionCreateInput
} from '@src/generated/prisma/models.js'

/** Models with an `order` column used for manual sort in the admin. */
export type OrderedModel = 'category' | 'page' | 'post' | 'project' | 'solution'

type CreateInput = {
  category: Omit<CategoryCreateInput, 'order'>
  page: Omit<PageCreateInput, 'order'>
  post: Omit<PostCreateInput, 'order'>
  project: Omit<ProjectCreateInput, 'order'>
  solution: Omit<SolutionCreateInput, 'order'>
}

/**
 * Inserts a record at the top of the sort list: new `order` is 0, existing rows increment by 1.
 */
export async function createAtTopOrder<M extends OrderedModel>(model: M, data: CreateInput[M]) {
  return prisma.$transaction(async (tx) => {
    switch (model) {
      case 'category': {
        const { type } = data as CategoryCreateInput

        await tx.category.updateMany({
          where: { type },
          data: { order: { increment: 1 } }
        })

        return tx.category.create({ data: { ...data, order: 0 } as CategoryCreateInput })
      }
      case 'page': {
        await tx.page.updateMany({ data: { order: { increment: 1 } } })
        return tx.page.create({ data: { ...data, order: 0 } as PageCreateInput })
      }
      case 'post': {
        await tx.post.updateMany({ data: { order: { increment: 1 } } })
        return tx.post.create({ data: { ...data, order: 0 } as PostCreateInput })
      }
      case 'project': {
        await tx.project.updateMany({ data: { order: { increment: 1 } } })
        return tx.project.create({ data: { ...data, order: 0 } as ProjectCreateInput })
      }
      case 'solution': {
        await tx.solution.updateMany({ data: { order: { increment: 1 } } })
        return tx.solution.create({ data: { ...data, order: 0 } as SolutionCreateInput })
      }
    }
  })
}
