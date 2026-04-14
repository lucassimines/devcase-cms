import { prisma } from '@src/db.js'
import type { Prisma } from '@src/generated/prisma/client.js'
import type { ProjectCreateInput, ProjectUpdateInput } from '@src/generated/prisma/models.js'

type ProjectWithTechnologies = Prisma.ProjectGetPayload<{
  include: { technologies: true }
}>

function normalizeProjectToForm(project: ProjectWithTechnologies) {
  return {
    ...project,
    technologies: project.technologies.map((t) => t.id)
  }
}

export class ProjectRepository {
  static async findById(id: string) {
    const project = await prisma.project.findFirst({
      where: { id },
      include: {
        technologies: true
      }
    })

    if (!project) return null

    return normalizeProjectToForm(project)
  }

  static create(data: ProjectCreateInput) {
    return prisma.project.create({
      data
    })
  }

  static async update(id: string, data: ProjectUpdateInput & { technologies: string[] }) {
    const { technologies, ...rest } = data

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...rest,
        technologies: {
          set: technologies?.map((id) => ({ id })) ?? []
        }
      },
      include: {
        technologies: true
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
