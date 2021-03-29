import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IUserState {
  userid: string // 用户id
  username: string
  userType: string
  userAvatar: string
  userMobile: string
  userAddress: string
  userDes: string
  userOcc: string
  userWeChatId: string // 微信Id
  userGithubId: string // Git Id
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public userid = '' // 用户id
  public username = ''
  public userType = ''
  public userAvatar = ''
  public userMobile = ''
  public userAddress = ''
  public userDes = ''
  public userOcc = ''
  public userWeChatId = '' // 微信Id
  public userGithubId = '' // Git Id

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
    this.username = data.username
    localStorage.setItem('username', data.username)
    localStorage.setItem('avatar', data.avatar)
    this.userType = data.is_extern_user
    this.userAvatar = data.avatar || require('@/assets/HAAIFF-01.png')
    this.userMobile = data.mobile
  }

  @Mutation
  setUserDetail(data: any) {
    this.userAddress = data.custom_user.data.url
    this.userDes = data.custom_user.data.des
    this.userOcc = data.custom_user.data.occ
  }

  @Mutation
  setUserId(data: any) {
    this.userid = data
  }

  @Mutation
  setUserAvatar(data: any) {
    this.userAvatar = data
  }

  @Action
  setUserInfo(data: any) {
    this.setUser(data)
  }
}

export const UserModule = getModule(User)
