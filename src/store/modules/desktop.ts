import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IDesktopCurrentApp {
  url: string
  name: string
}

export interface IDesktopState {
  desktopCurrentApp: IDesktopCurrentApp
  desktopStatus: string | null
}

@Module({ dynamic: true, store, name: 'desktop' })
class Desktop extends VuexModule implements IDesktopState {
  // desktopCurrentAppUrl 记录下当前页面呈现的app，将用于Breadcrumb组件中进行呈现相关文本
  private _desktopCurrentApp: IDesktopCurrentApp = {
    url: '',
    name: ''
  }
  private _desktopStatus: string = ''
  // two status: all and single
  public desktopStatus: string | null = this._desktopStatus || localStorage.getItem('desktop-status')

  public get desktopCurrentApp(): IDesktopCurrentApp {
    if (this._desktopCurrentApp.url) {
      return this._desktopCurrentApp
    }
    const localDesktopCurrentApp = localStorage.getItem('desktop-current-app')
    if (localDesktopCurrentApp) {
      this._desktopCurrentApp = JSON.parse(localDesktopCurrentApp)
    }
    return this._desktopCurrentApp
  }

  @Mutation
  private SET_DESKTOP_CURRENT_APP_URL(app: IDesktopCurrentApp) {
    this.desktopCurrentApp.url = app.url
    this.desktopCurrentApp.name = app.name || '应用'
  }

  @Mutation
  private SET_DESKTOP_STATUS(status: string) {
    this.desktopStatus = status
  }

  @Mutation
  private DELETE_DESKTOP_CACHE() {
    localStorage.removeItem('desktop-current-app')
    localStorage.removeItem('desktop-status')
  }

  @Action
  public setDesktopCurrentAppUrl(app: IDesktopCurrentApp) {
    this.SET_DESKTOP_CURRENT_APP_URL(app)
  }

  @Action
  public setDesktopStatus(status: string) {
    this.SET_DESKTOP_STATUS(status)
  }

  @Action
  public deleteDesktopCache() {
    this.DELETE_DESKTOP_CACHE()
  }

}

export const DesktopModule = getModule(Desktop)
