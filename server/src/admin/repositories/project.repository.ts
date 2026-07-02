import { prisma } from '@src/db.js'
import type { Prisma } from '@src/generated/prisma/client.js'
import type { ProjectCreateInput, ProjectUpdateInput } from '@src/generated/prisma/models.js'
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

  static create(data: ProjectCreateInput) {
    return createAtTopOrder('project', data)
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

    return normalizeProjectToForm(project)
  }

  static deleteMany(ids: string[]) {
    return prisma.project.deleteMany({
      where: { id: { in: ids } }
    })
  }

  static delete(id: string) {
    return prisma.project.delete({
      where: { id }
    })
  }
}
