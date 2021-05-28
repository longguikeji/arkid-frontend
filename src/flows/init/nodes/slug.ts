import { APINode } from "arkfbp/lib/apiNode"
import { TenantModule } from '@/store/modules/tenant'
import { getSlug } from '@/utils/url'

export class Slug extends APINode {
  async run() {
    // 通过 slug 查找
    const slug = getSlug()
    if (slug) {
      this.url = '/api/v1/tenant/' + slug + '/slug/'
      this.method = 'GET'
      try {
        const outputs = await super.run()
        if (outputs.uuid) {
          TenantModule.setHasSlug(true)
          TenantModule.changeCurrentTenant(outputs)
        }
      }
      catch (e) {
        console.error(e)
      }
    }
  }
}
