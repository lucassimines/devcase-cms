import 'dotenv/config'

import { prisma } from '../src/db.js'
import {
  migrateProjectBlocks,
  projectBlocksNeedMigration
} from '../src/utils/localized-json.utils.js'

async function main() {
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      blocks: true
    }
  })

  let updated = 0

  for (const project of projects) {
    if (!projectBlocksNeedMigration(project.blocks)) {
      console.log(`skip  ${project.slug} (blocks already localized)`)
      continue
    }

    const blocks = migrateProjectBlocks(project.blocks)

    await prisma.project.update({
      where: { id: project.id },
      data: { blocks }
    })

    updated += 1
    console.log(`updated ${project.slug} (${Array.isArray(blocks) ? blocks.length : 0} blocks)`)
  }

  console.log(`\nDone. Updated ${updated} of ${projects.length} projects.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
