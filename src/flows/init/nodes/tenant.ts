import { APINode } from "arkfbp/lib/apiNode"
import { TenantModule } from '@/store/modules/tenant'
import { getSlug } from '@/utils/url'
import getBaseUrl from '@/utils/get-base-url'
import { processUUId } from '@/utils/common'
import { getUrlParamByName } from '@/utils/url'
import { ConfigModule } from '@/store/modules/config'

export class TenantNode extends APINode {
  async run() {
    const slug = getSlug()
    if (slug !== '') { // 优先通过短连接获取租户信息
      this.url = `/api/v1/tenant/${slug}/slug/`
      this.method = 'GET'
      const res = await super.run()
      if (res.uuid) {
        ConfigModule.setSlug(slug)
        TenantModule.changeCurrentTenant(res)
      } else {
        const origin = ConfigModule.origin
        window.location.href = `${origin}/${getBaseUrl()}`
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
