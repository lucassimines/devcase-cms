import { prisma } from '@src/db.js'
import type { Prisma } from '@src/generated/prisma/client.js'
import type { ProjectCreateInput, ProjectUpdateInput } from '@src/generated/prisma/models.js'
import { WebCacheInvalidation } from '@src/web/cache/web-cache.invalidation.js'
import { createAtTopOrder } from '@src/utils/order.utils.js'

type ProjectWithIncludes = Prisma.ProjectGetPayload<{
  include: { technologies: true; solutions: true }
}>

function normalizeProjectToForm(project: ProjectWithIncludes) {
  return {
    ...project,
    technologies: project.technologies.map((t) => t.id),
    solutions: project.solutions.map((s) => s.id)
  }
}

export class ProjectRepository {
  static async findById(id: string) {
    const project = await prisma.project.findFirst({
      where: { id },
      include: {
        technologies: true,
        solutions: true
      }
    })

    if (!project) return null

    return normalizeProjectToForm(project)
  }

  static async create(data: ProjectCreateInput) {
    const project = await createAtTopOrder('project', data)

    WebCacheInvalidation.projects()

    return project
  }

  static async update(
    id: string,
    data: ProjectUpdateInput & { technologies: string[]; solutions: string[] }
  ) {
    const { technologies, solutions, ...rest } = data

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...rest,
        technologies: {
          set: technologies?.map((id) => ({ id })) ?? []
        },
        solutions: {
          set: solutions?.map((id) => ({ id })) ?? []
        }
      },
      include: {
        technologies: true,
        solutions: true
      }
    })

    WebCacheInvalidation.projects()

    return normalizeProjectToForm(project)
  }

  static async deleteMany(ids: string[]) {
    const result = await prisma.project.deleteMany({
      where: { id: { in: ids } }
    })

    WebCacheInvalidation.projects()

    return result
  }

  static async delete(id: string) {
    const result = await prisma.project.delete({
      where: { id }
    })

    WebCacheInvalidation.projects()

    return result
  }
}
