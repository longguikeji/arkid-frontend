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
  User = 'user',
  Tenant = 'tenant'
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

  @Mutation
  setUserMobile(mobile: string) {
    this.mobile = mobile
  }

  @Mutation
  setUserRole(role: UserRole) {
    this.role = role
  }

  @Mutation
  setUserInfo(data: any) {
    this.uuid = data.uuid
    this.username = data.username
    this.avatar = data.avatar
    this.mobile = data.mobile
    this.nickname = data.nickname
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
