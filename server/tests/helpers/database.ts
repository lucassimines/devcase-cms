import { execSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

import { TEST_DATABASE_ADMIN_URL, TEST_DATABASE_URL, TEST_ENV } from '@tests/env'

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

let prepared = false

export async function prepareTestDatabase() {
  if (prepared) return

  const testDbName = new URL(TEST_DATABASE_URL).pathname.slice(1)
  const client = new pg.Client({ connectionString: TEST_DATABASE_ADMIN_URL })

  try {
    await client.connect()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown database connection error'

    throw new Error(
      `Could not connect to Postgres at ${TEST_DATABASE_ADMIN_URL}. Start Docker with "make up" and try again. (${message})`
    )
  }

  try {
    const exists = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [testDbName])

    if (exists.rowCount === 0) {
      await client.query(`CREATE DATABASE "${testDbName}"`)
    }
  } finally {
    await client.end()
  }

  execSync('npx prisma migrate deploy', {
    cwd: serverRoot,
    env: { ...process.env, ...TEST_ENV },
    stdio: 'inherit'
  })

  prepared = true
}
