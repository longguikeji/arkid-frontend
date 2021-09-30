import { APINode } from "arkfbp/lib/apiNode"
import { TenantModule } from '@/store/modules/tenant'
import { getSlug } from '@/utils/url'
import getBaseUrl from '@/utils/get-base-url'
import { processUUId } from '@/utils/common'
import { getUrlParamByName } from '@/utils/url'
import { ConfigModule } from '@/store/modules/config'

export class TenantNode extends APINode {
  async run() {
    this.url = '/api/v1/tenant_switchinfo/'
    this.method = 'GET'
    const data = await super.run()
    const { platform_tenant_uuid: uuid, switch: tenantSwitch } = data
    TenantModule.setTenantSwitch(tenantSwitch)
    const slug = getSlug()
    if (slug === '') {
      TenantModule.changeCurrentTenant({ uuid })
      let platformUUId = uuid || getUrlParamByName('tenant') || getUrlParamByName('tenant_uuid')
      if (platformUUId) {
        platformUUId = processUUId(platformUUId)
        this.url = '/api/v1/tenant/' + platformUUId + '/'
        this.method = 'GET'
        const outputs = await super.run()
        if (outputs?.uuid) {
          TenantModule.changeCurrentTenant(outputs)
        }
      }
    } else {
      if (tenantSwitch === false) {
        this.toPlatform()
      } else {
        this.url = `/api/v1/tenant/${slug}/slug/`
        this.method = 'GET'
        const res = await super.run()
        if (res.uuid) {
          ConfigModule.setSlug(slug)
          TenantModule.changeCurrentTenant(res)
        } else {
          this.toPlatform()
        }
      }
    }
  }

  toPlatform() {
    const origin = ConfigModule.origin
    window.location.href = `${origin}/${getBaseUrl()}`
  }
}
