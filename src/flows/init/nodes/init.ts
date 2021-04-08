import { AuthApiNode } from '@/nodes/authApiNode'
import OpenAPI from '@/config/openapi'
import { TenantModule } from '@/store/modules/tenant'
import { UserModule } from '@/store/modules/user'

export class Init extends AuthApiNode {
  async run() {
    // 查找当前租户信息并保存在 TenantModule.currentTenant中进行统一管理
    const tenantUUId = TenantModule.currentTenant.uuid || location.hash.split('=')[1]
    this.url = '/api/v1/tenant/'
    this.method = 'get'
    const outputs = await super.run()
    if (tenantUUId) {
      outputs.results.forEach(output => {
        if (output.uuid === tenantUUId) {
          TenantModule.changeCurrentTenant({...output})
        }
      })
    }

    // 当用户已经登录后进行openAPI的访问，并生成动态路由内容，否则不进行生成
    const token = localStorage.getItem('token')
    if (token) {
      // 获取OpenAPI内容
      await OpenAPI.instance.init('/api/schema?format=json')
      // 此外，这里之后也可以进行当前用户信息的获取
      // 包括用户的头像、名称、用户的uuid以及用户的权限
    }

  }
}
