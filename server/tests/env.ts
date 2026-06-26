export const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ?? 'postgresql://postgres:root@localhost:5432/devcase_test'

export const TEST_DATABASE_ADMIN_URL =
  process.env.TEST_DATABASE_ADMIN_URL ?? 'postgresql://postgres:root@localhost:5432/postgres'

export const TEST_ENV = {
  NODE_ENV: 'test',
  API_BASE_PATH: '/api/v1',
  ACCESS_TOKEN_SECRET: 'test-access-token-secret',
  REFRESH_TOKEN_SECRET: 'test-refresh-token-secret',
  DATABASE_URL: TEST_DATABASE_URL,
  FILESYSTEM_STORAGE_PATH: './public/images'
} as const

export const TEST_USER = {
  email: 'test@devcase.local',
  password: 'test-password',
  name: 'Test User'
} as const
