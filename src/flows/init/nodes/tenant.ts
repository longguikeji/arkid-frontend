import { APINode } from "arkfbp/lib/apiNode"
import { TenantModule } from '@/store/modules/tenant'
import { getSlug } from '@/utils/url'
import { GlobalValueModule } from '@/store/modules/global-value'
import getBaseUrl from '@/utils/get-base-url'
import { processUUId } from '@/utils/common'
import { getUrlParamByName } from '@/utils/url'

export class Tenant extends APINode {
  async run() {
    // 优先通过 slug 查找当前租户信息
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
    } else {
      let tenantUUId = TenantModule.currentTenant.uuid || getUrlParamByName('tenant') || getUrlParamByName('tenant_uuid')
      if (tenantUUId) {
        tenantUUId = processUUId(tenantUUId)
        this.url = '/api/v1/tenant/' + tenantUUId + '/'
        this.method = 'GET'
        const outputs = await super.run()
        if (outputs?.uuid) {
          TenantModule.changeCurrentTenant(outputs)
        }
      }
    }
  }
}
