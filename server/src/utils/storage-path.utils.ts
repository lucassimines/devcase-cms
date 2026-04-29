import path from 'path'

const DEFAULT_STORAGE_PATH = './public/images'

export const storageDirectory = path.resolve(
  process.cwd(),
  process.env.FILESYSTEM_STORAGE_PATH || DEFAULT_STORAGE_PATH
)

export const staticDirectory = path.dirname(storageDirectory)
