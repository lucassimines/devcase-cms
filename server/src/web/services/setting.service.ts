import { SettingRepository } from '@src/admin/repositories/setting.repository.js'

export class SettingService {
  static async all() {
    const settings = await SettingRepository.all()
    return Object.fromEntries(settings.map(({ key, value }) => [key, value]))
  }
}
