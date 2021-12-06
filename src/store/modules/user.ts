import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IUserState {
  uuid: string
  username: string
  avatar?: string
  mobile?: string
  role?: UserRole
  nickname?: string
  userApps?: Array<IUserApp>
}

export interface IUserApp {
  name?: string
  logo?: string
  description?: string
  url?: string
  uuid?: string
  [key: string]: any
}

export enum UserRole {
  User = 'general user',
  Tenant = 'tenant admin',
  Global = 'global admin',
  Platform = 'platform user'
}

export enum UserRoleName {
  User = '普通用户',
  Tenant = '管理员',
  Global = '系统管理员'
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public uuid = ''
  public username = ''
  public avatar = ''
  public mobile = ''
  public role = UserRole.User
  public nickname = ''
  public userApps: Array<IUserApp> = []
  public roleName = UserRoleName.User

  @Mutation
  setUserMobile(mobile: string) {
    this.mobile = mobile
  }

  @Mutation
  setUserRole(role: UserRole) {
    this.role = role
    if (role === UserRole.User) {
      this.roleName = UserRoleName.User
    }
    if (role === UserRole.Tenant || role === UserRole.Platform) {
      this.roleName = UserRoleName.Tenant
    }
    if (role === UserRole.Global) {
      this.roleName = UserRoleName.Global
    }
  }

  @Mutation
  setUserInfo(user: IUserState) {
    this.uuid = user.uuid
    this.username = user.username
    this.avatar = user.avatar || ''
    this.mobile = user.mobile || ''
    this.nickname = user.nickname || ''
  }

  @Mutation
  setUserAvatar(avatar: string) {
    this.avatar = avatar
  }

  @Mutation
  setUserApps(apps: Array<IUserApp>) {
    this.userApps = apps
  }

}

export const UserModule = getModule(User)
