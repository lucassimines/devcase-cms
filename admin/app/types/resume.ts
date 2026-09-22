import { emptyLocalizedString } from '~/utils/locale'
import type { LocalizedString } from '~/types/locale'

export const RESUME_DEFAULT = {
  content: emptyLocalizedString()
}

export type ResumeContent = LocalizedString

export type ResumeData = {
  id?: string
  content?: ResumeContent
}
