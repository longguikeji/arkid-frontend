import { APINode } from "arkfbp/lib/apiNode"
import { TenantModule } from '@/store/modules/tenant'
import processUUId from '@/utils/process-uuid'
import { getUrlParamByName, getSlugByUrl } from '@/utils/url'

export class Tenant extends APINode {
  async run() {
    // 根据地址栏url中的slug或tenant_uuid 进行当前 tenant 获取
    let hasTenant = false, currentTenant
    
    // 优先通过 slug 查找
    const slug = getSlugByUrl()
    if (!hasTenant) {
      this.url = '/api/v1/tenant/' + slug + '/slug/'
      this.method = 'GET'
      const outputs = await super.run()
      if (outputs.uuid) {
        hasTenant = true
        currentTenant = outputs
      }
    }

    // 如果通过 slug 没有获取到，继续通过 tenant_uuid 获取
    if (!hasTenant) {
      let tenantUUId = TenantModule.currentTenant.uuid || getUrlParamByName('tenant')
      tenantUUId = processUUId(tenantUUId)
      this.url = '/api/v1/tenant/'
      this.method = 'get'
      const outputs = await super.run()
      outputs.results.forEach(output => {
        if (output.uuid === tenantUUId) { 
          currentTenant = output
        }
      })
    }

    // 如果当前的 currentTenant 有内容，并且当前的地址栏为 login ，将 tenant_uuid 自动添加入地址栏中
    if (window.location.pathname.includes('/login')) {
      const isTenant = getUrlParamByName('tenant')
      if (!isTenant && currentTenant?.uuid) {
        window.location.replace(window.location.href + '?tenant=' + currentTenant.uuid )
      }
    }

    // 将查到到的 tenant 内容存储到 TenantModule 对应的位置
    TenantModule.changeCurrentTenant(currentTenant)
  }
}
