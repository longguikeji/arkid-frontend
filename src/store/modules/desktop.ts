import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IDesktopCurrentApp {
  url: string
  name: string
}

export enum DesktopStatus {
  All,
  Single
}

export interface IDesktopState {
  desktopCurrentApp: IDesktopCurrentApp
  desktopStatus: DesktopStatus
}

@Module({ dynamic: true, store, name: 'desktop' })
class Desktop extends VuexModule implements IDesktopState {
  // desktopCurrentAppUrl 记录下当前页面呈现的app，将用于Breadcrumb组件中进行呈现相关文本
  // two status: all and single
  public desktopStatus: DesktopStatus = DesktopStatus.All
  public desktopCurrentApp: IDesktopCurrentApp = {
    url: '',
    name: ''
  }

  @Mutation
  private SET_DESKTOP_CURRENT_APP_URL(app: IDesktopCurrentApp) {
    this.desktopCurrentApp.url = app.url
    this.desktopCurrentApp.name = app.name || '应用'
  }

  @Mutation
  private SET_DESKTOP_STATUS(status: DesktopStatus) {
    this.desktopStatus = status
  }

  @Action
  public setDesktopCurrentAppUrl(app: IDesktopCurrentApp) {
    this.SET_DESKTOP_CURRENT_APP_URL(app)
  }

  @Action
  public setDesktopStatus(status: DesktopStatus) {
    this.SET_DESKTOP_STATUS(status)
  }
}

export const DesktopModule = getModule(Desktop)
