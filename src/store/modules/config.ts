import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { DEFAULT_PASSWORD_RULE } from '@/login/utils/rules'

interface IDesktopConfig {
  visible: boolean
  resize: boolean
}

interface IContactsConfig {
  isOpen: boolean
}

interface IUserConfig {
  isEditFields?: string[]
  isLoggingDevice?: boolean
  isLoggingIp?: boolean
  isLogout?: boolean
  isLookToken?: boolean
  isManualOverdueToken?: boolean
}

interface ITenantConfig {
  closePageAutoLogout: boolean
  uploadFileFormat: string[]
}

interface IPasswordComplexity {
  regular: RegExp,
  title: string
}

export interface IConfigState {
  origin: string // ArkID平台的Location.origin
  slug: string // 当前租户的短连接标识符
  desktop: IDesktopConfig // 桌面配置
  contacts: IContactsConfig // 通讯录配置
  user: IUserConfig // 用户配置
  tenant: ITenantConfig // 租户配置
}

@Module({ dynamic: true, store, name: 'config' })
class Config extends VuexModule implements IConfigState {
  public origin: string = ''
  public slug: string = ''
  public desktop: IDesktopConfig = {
    visible: true,
    resize: true
  }
  public contacts: IContactsConfig = {
    isOpen: true
  }
  public user: IUserConfig = {
    isEditFields: [],
    isLoggingDevice: true,
    isLoggingIp: true,
    isLogout: true,
    isLookToken: true,
    isManualOverdueToken: true
  }
  public tenant: ITenantConfig = {
    closePageAutoLogout: false,
    uploadFileFormat: []
  }
  public passwordComplexity: IPasswordComplexity = {
    regular: DEFAULT_PASSWORD_RULE.regex,
    title: DEFAULT_PASSWORD_RULE.hint
  }

  @Mutation
  setOrigin(origin: string = '') {
    this.origin = origin
  }

  @Mutation
  setSlug(slug: string = '') {
    this.slug = slug
  }

  @Mutation
  setDesktopConfig(config: IDesktopConfig) {
    this.desktop = Object.assign(this.desktop, config)
  }

  @Mutation
  setContactsConfig(config: IContactsConfig) {
    this.contacts = Object.assign(this.contacts, config)
  }

  @Mutation
  setUserConfig(config: IUserConfig) {
    this.user = Object.assign(this.user, config)
  }
  
  @Mutation
  setTenantConfig(config: ITenantConfig) {
    this.tenant = Object.assign(this.tenant, config)
  }

  @Mutation
  setPasswordComplexify(config: IPasswordComplexity) {
    this.passwordComplexity = Object.assign(this.passwordComplexity, config)
  }

}

export const ConfigModule = getModule(Config)
