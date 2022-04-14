import { APINode } from '@/arkfbp/nodes/apiNode'
import { UserModule, UserRole } from '@/store/modules/user'
import { TenantModule } from '@/store/modules/tenant'
import { ConfigModule } from '@/store/modules/config'
import OpenAPI, { IRolesDescribe } from '@/config/openapi'
import { processUUId } from '@/utils/common'
import { PermissionModule } from '@/store/modules/permission'

export class ConfigNode extends APINode {
  async run() {
    // get method
    this.method = 'get'

    // config current login user info
    await this.setCurrentUserInfo()

    // config current login user role
    await this.setCurrentUserRole()

    const uuid = TenantModule.currentTenant.uuid
    if (uuid) {
      // 桌面配置信息
      await this.setDesktopConfig(uuid)
      // 通讯录配置信息
      await this.setContactsConfig(uuid)
      // 用户配置信息
      await this.setUserConfig(uuid)
      // 租户配置信息
      await this.setTenantConfig(uuid)
      // 租户密码复杂度
      await this.setTenantPasswordComplexity(uuid)
      // 获取当前用户的权限
      await this.getCurrentUserPermission(uuid)
    }
  }

  async setCurrentUserInfo() {
    this.url = '/api/v1/user/info/'
    const outputs = await super.run()
    if (outputs?.uuid) {
      UserModule.setUserInfo(outputs)
    }
  }

  async setCurrentUserRole() {
    this.url = '/api/v1/user/manage_tenants/'
    const outputs = await super.run()
    const isGlobalAdmin = outputs?.is_global_admin
    const isPlatformUser = outputs?.is_platform_user
    const manageTenants = outputs?.manage_tenants
    if (isGlobalAdmin) {
      UserModule.setUserRole(UserRole.Global)
    } else if (manageTenants?.length) {
      const uuid = TenantModule.currentTenant.uuid
      const tenantManager =
        uuid &&
        manageTenants.find((item) => {
          item = processUUId(item)
          return item === processUUId(uuid)
        })
      if (tenantManager) {
        UserModule.setUserRole(UserRole.Tenant)
      } else {
        isPlatformUser
          ? UserModule.setUserRole(UserRole.Platform)
          : UserModule.setUserRole(UserRole.User)
      }
    } else if (isPlatformUser) {
      UserModule.setUserRole(UserRole.Platform)
    } else {
      UserModule.setUserRole(UserRole.User)
    }
  }

  async setDesktopConfig(uuid: string) {
    this.url = `/api/v1/tenant/${uuid}/desktopconfig/`
    const outputs = await super.run()
    const data = outputs?.data
    if (data) {
      ConfigModule.setDesktopConfig({
        visible: data.access_with_desktop,
        resize: data.icon_custom,
      })
    }
  }

  async setContactsConfig(uuid: string) {
    this.url = `/api/v1/tenant/${uuid}/contactsconfig/function_switch/`
    this.method = 'GET'
    const outputs = await super.run()
    const data = outputs?.data
    if (data) {
      ConfigModule.setContactsConfig({
        isOpen: data.is_open,
      })
    }
  }

  async setUserConfig(uuid: string) {
    await this.setUserConfigLogging(uuid)
    await this.setUserConfigLogout(uuid)
    await this.setUserConfigEditFields(uuid)
    await this.setUserConfigToken(uuid)
  }

  async setTenantConfig(uuid: string) {
    this.url = `/api/v1/tenant/${uuid}/config/login_register/`
    this.method = 'GET'
    const outputs = await super.run()
    const data = outputs?.data
    if (data) {
      ConfigModule.setTenantConfig({
        closePageAutoLogout: data.close_page_auto_logout,
        uploadFileFormat: data.upload_file_format,
      })
    }
  }

  async setTenantPasswordComplexity(uuid: string) {
    this.url = `/api/v1/config/current_password_complexity/?tenant=${uuid}`
    this.method = 'GET'
    const outputs = await super.run()
    const data = outputs?.data
    if (data) {
      ConfigModule.setPasswordComplexify({
        regular: data.regular,
        title: data.title,
      })
    }
  }

  async setUserConfigLogging(uuid: string) {
    if (
      OpenAPI.instance.getOperation(
        '/api/v1/tenant/{tenant_uuid}/userconfig/logging',
        'get',
      )
    ) {
      this.url = `/api/v1/tenant/${uuid}/userconfig/logging`
      this.method = 'GET'
      const data = await super.run()
      if (data) {
        ConfigModule.setUserConfig({
          isLoggingDevice: data.is_logging_device,
          isLoggingIp: data.is_logging_ip,
        })
      }
    }
  }

  async setUserConfigLogout(uuid: string) {
    if (
      OpenAPI.instance.getOperation(
        '/api/v1/tenant/{tenant_uuid}/userconfig/logout',
        'get',
      )
    ) {
      this.url = `/api/v1/tenant/${uuid}/userconfig/logout`
      this.method = 'GET'
      const data = await super.run()
      if (data) {
        ConfigModule.setUserConfig({
          isLogout: data.is_logout,
        })
      }
    }
  }

  async setUserConfigEditFields(uuid: string) {
    if (
      OpenAPI.instance.getOperation(
        '/api/v1/tenant/{tenant_uuid}/userconfig/editfields',
        'get',
      )
    ) {
      this.url = `/api/v1/tenant/${uuid}/userconfig/editfields`
      this.method = 'GET'
      const data = await super.run()
      if (data?.results) {
        const fields = data.results.map((field) => {
          return field.en_name || field.name
        })
        ConfigModule.setUserConfig({
          isEditFields: fields,
        })
      }
    }
  }

  async setUserConfigToken(uuid: string) {
    if (
      OpenAPI.instance.getOperation(
        '/api/v1/tenant/{tenant_uuid}/userconfig/token',
        'get',
      )
    ) {
      this.url = `/api/v1/tenant/${uuid}/userconfig/token`
      this.method = 'GET'
      const data = await super.run()
      if (data) {
        ConfigModule.setUserConfig({
          isLookToken: data.is_look_token,
          isManualOverdueToken: data.is_manual_overdue_token,
        })
      }
    }
  }

  async getCurrentUserPermission(uuid: string) {
    this.url = `/api/v1/tenant/${uuid}/userpermission_groups/`
    this.method = 'GET'
    const outputs = await super.run()
    if (!outputs) return
    // 存储当前用户的权限
    const { en_names, global_en_names } = outputs
    // 处理en_names和global_en_names, 方便在生成路由时直接读取
    const { children } = OpenAPI.instance.getRolesDescribe() || {}
    if (!children?.length) return
    this.getUserRoutePermission(children, en_names, global_en_names)
    PermissionModule.setPermission({
      en_names: this._userRouteNames,
      global_en_names: this._globalRouteNames,
    })
  }

  private _globalRouteNames: string[] = []
  private _userRouteNames: string[] = []

  getUserRoutePermission(
    children: IRolesDescribe[],
    enNames: string[] = [],
    globalEnNames: string[] = [],
    prefix: string = '',
  ) {
    for (const child of children) {
      const { name, code, children: c } = child
      const routeCode = prefix ? `${prefix}.${code}` : code
      if (enNames.includes(routeCode)) this._userRouteNames.push(name)
      if (globalEnNames.includes(routeCode)) this._globalRouteNames.push(name)
      if (c?.length)
        this.getUserRoutePermission(c, enNames, globalEnNames, code)
    }
  }
}
