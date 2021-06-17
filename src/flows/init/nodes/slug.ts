import { APINode } from "arkfbp/lib/apiNode"
import { TenantModule } from '@/store/modules/tenant'
import { getSlug } from '@/utils/url'
import { GlobalValueModule } from '@/store/modules/global-value'
import getBaseUrl from '@/utils/get-base-url'

export class Slug extends APINode {
  async run() {
    // 通过 slug 查找
    const slug = getSlug()
    if (slug) {
      this.url = '/api/v1/tenant/' + slug + '/slug/'
      this.method = 'GET'
      const outputs = await super.run()
      if (outputs.uuid) {
        GlobalValueModule.setSlug(slug)
        TenantModule.changeCurrentTenant(outputs)
      } else {
        const originUrl = GlobalValueModule.originUrl
        const newHref = originUrl + "/" + getBaseUrl()
        window.location.href = newHref
      }
    }
  }
}
