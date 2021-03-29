import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IAccountState {
  showComponent: string, //用户登录方式
  accountMaskShow: boolean,
  old_sms_token: string,
}

@Module({ dynamic: true, store, name: 'account' })
class Account extends VuexModule implements IAccountState {
  public showComponent = '' //用户登录方式
  public accountMaskShow = false
  public old_sms_token = ''

  @Mutation
  setOldSms(data: any) {
    this.old_sms_token = data;
  }

  @Action
  setOldSmsToken(data: any) {
    this.setOldSms(data);
  }
}

export const AccountModule = getModule(Account)