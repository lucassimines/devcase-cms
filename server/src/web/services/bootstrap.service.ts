import { PageService } from '@src/web/services/page.service.js'

export class BootstrapService {
  static async index() {
    const pages = await PageService.menuPages()

    return {
      menu: {
        links: pages
      }
    }
  }
}
