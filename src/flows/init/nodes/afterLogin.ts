import { AuthApiNode } from '@/arkfbp/nodes/authApiNode'
import OpenAPI from '@/config/openapi'
import { UserModule, UserRole } from '@/store/modules/user'
import { TenantModule } from '@/store/modules/tenant'
import processUUId from '@/utils/process-uuid'
import { getUrlParamByName } from '@/utils/url'

export class AfterLogin extends AuthApiNode {

  async run() {
    // 当用户已经登录后进行openAPI的访问，并生成动态路由内容，否则不进行生成
    await OpenAPI.instance.init('/api/schema?format=json')
    // 获取当前租户
    if (!TenantModule.currentTenant.uuid) {
      await this.setCurrentTenantInfo()
    }
    // 获取用户信息
    await this.setCurrentUserInfo()
    // 获取用户权限
    await this.setCurrentUserPermission()
  }

  async setCurrentTenantInfo() {
    let tenantUUId = TenantModule.currentTenant.uuid || getUrlParamByName('tenant') || getUrlParamByName('tenant_uuid')
    tenantUUId = processUUId(tenantUUId)
    this.url = '/api/v1/tenant/'
    this.method = 'GET'
    const outputs = await super.run()
    if (outputs && outputs.results) {
      outputs.results.forEach(output => {
        if (output.uuid === tenantUUId || outputs.results.length === 1) { 
          TenantModule.changeCurrentTenant(output)
        }
      })
    }
  }

  async setCurrentUserInfo() {
    this.url = '/api/v1/user/info/'
    this.method = 'GET'
    const userInfo = await super.run()
    if (userInfo) {
      UserModule.setUserInfo(userInfo)
    }
  }

  async setCurrentUserPermission() {
    this.url = '/api/v1/user/manage_tenants/'
    this.method = 'GET'
    const res = await super.run()
    const isGlobalAdmin = res?.is_global_admin
    const manageTenants = res?.manage_tenants
    const currentTenantUUId = TenantModule.currentTenant.uuid
    if (isGlobalAdmin) {
      UserModule.setUserRole(UserRole.Global)
    } else if (manageTenants?.length && currentTenantUUId) {
      for (let i = 0, len = manageTenants.length; i < len; i++) {
        let uuid = manageTenants[i]
        uuid = processUUId(uuid)
        if (uuid === currentTenantUUId) {
          UserModule.setUserRole(UserRole.Tenant)
          break
        }
      }
    } else {
      UserModule.setUserRole(UserRole.User)
    }
  }

}
