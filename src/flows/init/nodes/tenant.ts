import { APINode } from "arkfbp/lib/apiNode"
import { TenantModule } from '@/store/modules/tenant'
import processUUId from '@/utils/process-uuid'
import { getUrlParamByName, getSlug } from '@/utils/url'

export class Tenant extends APINode {
  async run() {
    // 根据地址栏 url 中的 slug 或 tenant_uuid 进行当前 tenant 获取
    let currentTenant

    // 优先通过 slug 查找
    const slug = getSlug()
    if (slug) {
      this.url = '/api/v1/tenant/' + slug + '/slug/'
      this.method = 'GET'
      const outputs = await super.run()
      if (outputs.uuid) {
        currentTenant = outputs
      }
    } else {
      // 如果通过 slug 没有获取到，继续通过 tenant_uuid 获取
      let tenantUUId = TenantModule?.currentTenant?.uuid || getUrlParamByName('tenant') || getUrlParamByName('tenant_uuid')
      tenantUUId = processUUId(tenantUUId)
      this.url = '/api/v1/tenant/'
      this.method = 'get'
      const outputs = await super.run()
      outputs.results.forEach(output => {
        if (output.uuid === tenantUUId || outputs.results.length === 1) { 
          currentTenant = output
        }
      })
    }

    // 将查到到的 tenant 内容存储到 TenantModule 对应的位置
    TenantModule.changeCurrentTenant(currentTenant)
  }
}
