import { AuthApiNode } from '@/arkfbp/nodes/authApiNode'
import OpenAPI from '@/config/openapi'
import { UserModule, UserRole } from '@/store/modules/user'
import { TenantModule } from '@/store/modules/tenant'
import { GlobalValueModule } from '@/store/modules/global-value'
import { processUUId } from '@/utils/common'

export class AfterLogin extends AuthApiNode {

  async run() {
    // 当用户已经登录后进行openAPI的访问，并生成动态路由内容，否则不进行生成
    await OpenAPI.instance.init('/api/schema?format=json')
    // 若登录后依然没有当前租户信息，查看租户列表是否只有一个租户，如果只有一个租户，直接选中该租户为当前租户
    if (!TenantModule.currentTenant.uuid) {
      await this.setCurrentTenantInfo()
    }
    const tenantUUId = TenantModule.currentTenant.uuid
    // 获取用户信息
    await this.setCurrentUserInfo()
    // 设置其他变量
    if (tenantUUId) {
      // 获取用户权限
      await this.setCurrentUserPermission(tenantUUId)
      // 获取租户config
      await this.setTenantConfig(tenantUUId)
      // 获取租户的密码复杂度
      await this.setTenantPasswordComplexity(tenantUUId)
    } else {
      UserModule.setUserRole(UserRole.Platform)
    }
  }

  async setCurrentTenantInfo() {
    this.url = '/api/v1/tenant/'
    this.method = 'GET'
    const data = await super.run()
    const res = data?.results
    if (res?.length === 1) {
      TenantModule.changeCurrentTenant(res[0])
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

  async setCurrentUserPermission(tenantUUId: string) {
    this.url = '/api/v1/user/manage_tenants/'
    this.method = 'GET'
    const res = await super.run()
    const isGlobalAdmin = res?.is_global_admin
    const isPlatformUser = res?.is_platform_user
    const manageTenants = res?.manage_tenants
    // console.log('权限信息', res)
    if (isGlobalAdmin) {
      UserModule.setUserRole(UserRole.Global)
    } else if (manageTenants?.length && tenantUUId) {
      for (let i = 0, len = manageTenants.length; i < len; i++) {
        let uuid = manageTenants[i]
        uuid = processUUId(uuid)
        if (uuid === tenantUUId) {
          UserModule.setUserRole(UserRole.Tenant)
          break
        }
      }
    } else if (isPlatformUser) {
      UserModule.setUserRole(UserRole.Platform)
    } else {
      UserModule.setUserRole(UserRole.User)
    }
  }

  async setTenantConfig(tenantUUId: string) {
    this.url = `/api/v1/tenant/${tenantUUId}/config/login_register/`
    this.method = 'GET'
    const data = await super.run()
    GlobalValueModule.setGlobalConfig(data)
  }

  async setTenantPasswordComplexity(tenantUUId: string) {
    this.url = `/api/v1/tenant/${tenantUUId}/current_password_complexity/`
    this.method = 'GET'
    const data = await super.run()
    GlobalValueModule.setPasswordComplexify(data)
  }

}
