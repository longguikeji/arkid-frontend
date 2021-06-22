import { AuthApiNode } from '@/arkfbp/nodes/authApiNode'
import OpenAPI from '@/config/openapi'
import { UserModule, UserRole } from '@/store/modules/user'
import { TenantModule } from '@/store/modules/tenant'
import { GlobalValueModule } from '@/store/modules/global-value'
import processUUId from '@/utils/process-uuid'

export class AfterLogin extends AuthApiNode {

  async run() {
    // 当用户已经登录后进行openAPI的访问，并生成动态路由内容，否则不进行生成
    await OpenAPI.instance.init('/api/schema?format=json')
    // 若登录后依然没有当前租户信息，查看租户列表是否只有一个租户，如果只有一个租户，直接选中该租户为当前租户
    if (!TenantModule.currentTenant.uuid) {
      await this.setCurrentTenantInfo()
    }
    // 获取用户信息
    await this.setCurrentUserInfo()
    // 获取用户权限
    await this.setCurrentUserPermission()
    // 获取config
    await this.setTenantConfig()
  }

  async setCurrentTenantInfo() {
    this.url = '/api/v1/tenant/'
    this.method = 'GET'
    const { results } = await super.run()
    if (results?.length === 1) {
      TenantModule.changeCurrentTenant(results[0])
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

  async setTenantConfig() {
    this.url = `/api/v1/tenant/${TenantModule.currentTenant.uuid}/config/`
    this.method = 'GET'
    const { data } = await super.run()
    GlobalValueModule.setClosePageAutoLogout(data?.close_page_auto_logout || false)
  }

}
