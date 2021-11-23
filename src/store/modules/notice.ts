import { VuexModule, Module, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface INoticeState {
  notice: any
}

@Module({ dynamic: true, store, name: 'notice' })
class Notice extends VuexModule implements INoticeState {
  public notice = [
    {
      name: '1',
      label: '通知(3)',
      items: [
        {
          content: '1. 欢迎使用ArkID一账通',
          created: '2021.01.01'
        },
        {
          content: '2. 早会通知',
          created: '2021.11.22'
        },
        {
          content: '3. 项目进展会议',
          created: '2021.11.20'
        }
      ]
    }
  ]

  @Mutation
  public setNotice(payload: any) {
    this.notice = payload
  }
}

export const NoticeModule = getModule(Notice)
