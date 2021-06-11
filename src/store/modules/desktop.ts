import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IDesktopSingleApp {
  url: string
  name: string
  uuid: string
}

export interface IDesktopState {
  desktopCurrentApp: IDesktopSingleApp | null
}

@Module({ dynamic: true, store, name: 'desktop' })
class Desktop extends VuexModule implements IDesktopState {
  public desktopCurrentApp: IDesktopSingleApp | null = null

  @Mutation
  private UPDATE_CURRENT_DESKTOP_APP(app: IDesktopSingleApp | null) {
    this.desktopCurrentApp = app
  }

  @Action
  public updateCurrentDesktopApp(app: IDesktopSingleApp | null) {
    this.UPDATE_CURRENT_DESKTOP_APP(app)
  }

}

export const DesktopModule = getModule(Desktop)
