import { AuthApiNode } from '@/nodes/authApiNode'
import OpenAPI from '@/config/openapi'
import { UserModule } from '@/store/modules/user'
import { TenantModule } from '@/store/modules/tenant'
import processUUId from '@/utils/process-uuid'
import { getUrlParamByName } from '@/utils/url'

export class AfterLogin extends AuthApiNode {
  async run() {
    // 当用户已经登录后进行openAPI的访问，并生成动态路由内容，否则不进行生成
    // 获取OpenAPI内容
    await OpenAPI.instance.init('/api/schema?format=json')

    // 此时进行tenant的获取
    if (TenantModule.currentTenant.uuid === undefined) {
      let tenantUUId = TenantModule?.currentTenant?.uuid || getUrlParamByName('tenant') || getUrlParamByName('tenant_uuid')
      tenantUUId = processUUId(tenantUUId)
      this.url = '/api/v1/tenant/'
      this.method = 'GET'
      const outputs = await super.run()
      outputs.results.forEach(output => {
        if (output.uuid === tenantUUId || outputs.results.length === 1) { 
          TenantModule.changeCurrentTenant(output)
        }
      })
    }

    // 进行用户信息的获取，包括用户的头像、名称、用户的uuid以及用户的权限
    this.url = '/api/v1/user/info/'
    this.method = 'GET'
    const userInfo = await super.run()
    UserModule.setUser(userInfo)
  }
}
