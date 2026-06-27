import { PageService } from '@src/web/services/page.service.js'
import { SettingService } from '@src/web/services/setting.service.js'

export class BootstrapService {
  static async index() {
    const [pages, settings] = await Promise.all([PageService.menuPages(), SettingService.all()])

    return {
      menu: {
        links: pages
      },
      settings
    }
  }
}
