import { APINode } from '@/arkfbp/nodes/apiNode'
import { UserModule, UserRole } from '@/store/modules/user'
import { TenantModule } from '@/store/modules/tenant'
import { ConfigModule } from '@/store/modules/config'
import { processUUId } from '@/utils/common'
import OpenAPI from '@/config/openapi'

export class ConfigNode extends APINode {

  async run() {
    // 如若登录之后依旧没有租户信息，则去进行查询租户列表
    // 如果租户列表只有一个租户，则自动将该租户设置为当前登录租户
    if (!TenantModule.currentTenant.uuid) {
      await this.setCurrentTenantInfo()
    }

    // 配置当前用户个人信息 昵称...
    await this.setCurrentUserInfo()
    
    const tenantUUId = TenantModule.currentTenant.uuid
    // 配置当前登录账号角色
    await this.setCurrentUserRole(tenantUUId)
    if (tenantUUId) {
      // 桌面配置信息
      await this.setDesktopConfig(tenantUUId)
      // 通讯录配置信息
      await this.setContactsConfig(tenantUUId)
      // 用户配置信息
      await this.setUserConfig(tenantUUId)
      // 租户配置信息
      await this.setTenantConfig(tenantUUId)
      // 租户密码复杂度
      await this.setTenantPasswordComplexity(tenantUUId)
      // 获取当前用户的权限
      await this.getCurrentUserPermission(tenantUUId)
    }
  }

  async setCurrentTenantInfo() {
    this.url = '/api/v1/tenant/'
    this.method = 'GET'
    const outputs = await super.run()
    const res = outputs?.results
    if (res?.length === 1) {
      TenantModule.changeCurrentTenant(res[0])
    }
  }

  async setCurrentUserInfo() {
    this.url = '/api/v1/user/info/'
    this.method = 'GET'
    const outputs = await super.run()
    if (outputs) {
      UserModule.setUserInfo(outputs)
    }
  }

  async setCurrentUserRole(tenantUUId: string | undefined) {
    if (tenantUUId) {
      this.url = '/api/v1/user/manage_tenants/'
      this.method = 'GET'
      const outputs = await super.run()
      const isGlobalAdmin = outputs?.is_global_admin
      const isPlatformUser = outputs?.is_platform_user
      const manageTenants = outputs?.manage_tenants
      if (isGlobalAdmin) {
        UserModule.setUserRole(UserRole.Global)
      } else if (manageTenants?.length) {
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
    } else {
      UserModule.setUserRole(UserRole.Platform)
    }
  }

  async setDesktopConfig(tenantUUId: string) {
    this.url = `/api/v1/tenant/${tenantUUId}/desktopconfig/`
    this.method = 'GET'
    const outputs = await super.run()
    const data = outputs?.data
    if (data) {
      ConfigModule.setDesktopConfig({
        visible: data.access_with_desktop,
        resize: data.icon_custom,
      })
    }
  }

  async setContactsConfig(tenantUUId: string) {
    this.url = `/api/v1/tenant/${tenantUUId}/contactsconfig/function_switch/`
    this.method = 'GET'
    const outputs = await super.run()
    const data = outputs?.data
    if (data) {
      ConfigModule.setContactsConfig({
        isOpen: data.is_open
      })
    }
  }

  async setUserConfig(tenantUUId: string) {
    await this.setUserConfigLogging(tenantUUId)
    await this.setUserConfigLogout(tenantUUId)
    await this.setUserConfigEditFields(tenantUUId)
    await this.setUserConfigToken(tenantUUId)
  }

  async setTenantConfig(tenantUUId: string) {
    this.url = `/api/v1/tenant/${tenantUUId}/config/login_register/`
    this.method = 'GET'
    const outputs = await super.run()
    const data = outputs?.data
    if (data) {
      ConfigModule.setTenantConfig({
        closePageAutoLogout: data.close_page_auto_logout,
        uploadFileFormat: data.upload_file_format
      })
    }
  }

  async setTenantPasswordComplexity(tenantUUId: string) {
    this.url = `/api/v1/config/current_password_complexity/?tenant=${tenantUUId}`
    this.method = 'GET'
    const outputs = await super.run()
    const data = outputs?.data
    if (data) {
      ConfigModule.setPasswordComplexify({
        regular: data.regular,
        title: data.title
      })
    }
  }

  async setUserConfigLogging(tenantUUId: string) {
    if (OpenAPI.instance.getOperation('/api/v1/tenant/{tenant_uuid}/userconfig/logging', 'get')) {
      this.url = `/api/v1/tenant/${tenantUUId}/userconfig/logging`
      this.method = 'GET'
      const data = await super.run()
      if (data) {
        ConfigModule.setUserConfig({
          isLoggingDevice: data.is_logging_device,
          isLoggingIp: data.is_logging_ip
        })
      }
    }
  }

  async setUserConfigLogout(tenantUUId: string) {
    if (OpenAPI.instance.getOperation('/api/v1/tenant/{tenant_uuid}/userconfig/logout', 'get')) {
      this.url = `/api/v1/tenant/${tenantUUId}/userconfig/logout`
      this.method = 'GET'
      const data = await super.run()
      if (data) {
        ConfigModule.setUserConfig({
          isLogout: data.is_logout
        })
      }
    }
  }

  async setUserConfigEditFields(tenantUUId: string) {
    if (OpenAPI.instance.getOperation('/api/v1/tenant/{tenant_uuid}/userconfig/editfields', 'get')) {
      this.url = `/api/v1/tenant/${tenantUUId}/userconfig/editfields`
      this.method = 'GET'
      const data = await super.run()
      if (data?.results) {
        const fields = data.results.map(field => {
          return field.en_name || field.name
        })
        ConfigModule.setUserConfig({
          isEditFields: fields
        })
      }
    }
  }

  async setUserConfigToken(tenantUUId: string) {
    if (OpenAPI.instance.getOperation('/api/v1/tenant/{tenant_uuid}/userconfig/token', 'get')) {
      this.url = `/api/v1/tenant/${tenantUUId}/userconfig/token`
      this.method = 'GET'
      const data = await super.run()
      if (data) {
        ConfigModule.setUserConfig({
          isLookToken: data.is_look_token,
          isManualOverdueToken: data.is_manual_overdue_token
        })
      }
    }
  }

  async getCurrentUserPermission(tenantUUId: string) {
    // this.url = `/api/v1/tenant/${tenantUUId}/check_permission/`
    // this.method = 'GET'
    // const data = await super.run()
  }
}