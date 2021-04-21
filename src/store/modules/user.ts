import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IUserState {
  userUUId: string
  username: string
  userType: string
  userAvatar: string
  userMobile: string
  userAddress: string
  userDes: string
  userOcc: string
  userWeChatId: string
  userGithubId: string
  userPermissions: Array<string>
  userNickname: string
  userApps: Array<IUserApp>
}

export interface IUserApp {
  name?: string
  logo?: string
  description?: string
  url?: string
  uuid?: string
  [key: string]: any
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public userUUId = '' // 用户id
  public username = ''
  public userType = ''
  public userAvatar = ''
  public userMobile = ''
  public userAddress = ''
  public userDes = ''
  public userOcc = ''
  public userWeChatId = '' // 微信Id
  public userGithubId = '' // Git Id
  public userPermissions = []
  public userNickname = ''
  public userApps = []

  @Mutation
  setUserMobile(mobile: string) {
    this.userMobile = mobile
  }

  @Mutation
  setGithubId(github_id: string) {
    this.userGithubId = github_id
  }

  @Mutation
  setWechatId(wechat_id: string) {
    this.userWeChatId = wechat_id
  }

  @Mutation
  setUser(data: any) {
    this.userUUId = data.uuid
    this.username = data.username
    this.userAvatar = data.avatar
    this.userMobile = data.mobile
    this.userType = data.is_extern_user
    this.userNickname = data.nickname
  }

  @Mutation
  setUserDetail(data: any) {
    this.userAddress = data.custom_user.data.url
    this.userDes = data.custom_user.data.des
    this.userOcc = data.custom_user.data.occ
  }

  @Mutation
  setUserAvatar(data: any) {
    this.userAvatar = data
  }

  @Mutation
  setUserApps(apps: any) {
    this.userApps = apps
  }

  @Action
  setUserInfo(data: any) {
    this.setUser(data)
  }
}

export const UserModule = getModule(User)
