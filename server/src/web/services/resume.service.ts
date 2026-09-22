import { ResumeRepository } from '@src/admin/repositories/resume.repository.js'
import { toLocalizedString } from '@src/utils/localized-json.utils.js'

export class ResumeService {
  static async content() {
    const resume = await ResumeRepository.findFirst()
    return toLocalizedString(resume?.content)
  }
}
