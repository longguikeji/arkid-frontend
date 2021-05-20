import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { getDesktopStatus, setDesktopStatus, getDesktopApp, setDesktopApp, removeDesktopApp } from '@/utils/cookies'
import store from '@/store'

export interface IDesktopSingleApp {
  url: string
  name: string
}

export interface IDesktopState {
  isSingle: boolean
  desktopVisitedApps: Array<IDesktopSingleApp>
}

export enum DesktopStatus {
  AllApp = 'all',
  SingleApp = 'single',
}

@Module({ dynamic: true, store, name: 'desktop' })
class Desktop extends VuexModule implements IDesktopState {
  public isSingle: boolean = getDesktopStatus() === DesktopStatus.SingleApp
  public desktopVisitedApps: Array<IDesktopSingleApp> = []

  @Mutation
  private SET_DESKTOP_STATUS(isSingle: boolean) {
    this.isSingle = isSingle
    if (isSingle) {
      setDesktopStatus(DesktopStatus.SingleApp)
    } else {
      setDesktopStatus(DesktopStatus.AllApp)
    }
  }

  @Mutation
  private ADD_DESKTOP_APP(app: IDesktopSingleApp) {
    setDesktopApp(JSON.stringify(app))
    this.desktopVisitedApps.push(app)
  }

  @Mutation
  private REMOVE_DESKTOP_APP() {
    removeDesktopApp()
  }

  @Action
  public setDesktopStatus(isSingle: boolean) {
    this.SET_DESKTOP_STATUS(isSingle)
  }

  @Action
  public addDesktopApp(app: IDesktopSingleApp) {
    this.ADD_DESKTOP_APP(app)
  }

  @Action
  public removeDesktopApp() {
    this.REMOVE_DESKTOP_APP()
  }
}

export const DesktopModule = getModule(Desktop)
