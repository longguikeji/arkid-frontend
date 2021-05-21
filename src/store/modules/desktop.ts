import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IDesktopSingleApp {
  url: string
  name: string
}

export interface IDesktopState {
  desktopVisitedApps: Array<IDesktopSingleApp | null>
}

@Module({ dynamic: true, store, name: 'desktop' })
class Desktop extends VuexModule implements IDesktopState {
  public desktopVisitedApps: Array<IDesktopSingleApp> = []

  @Mutation
  private ADD_DESKTOP_APP(app: IDesktopSingleApp | null) {
    if (app) {
      const sameApps = this.desktopVisitedApps.filter((visitedApp) => {
        return visitedApp?.name === app.name || visitedApp?.url === app.url
      })
      if (sameApps.length === 0) {
        this.desktopVisitedApps.push(app)
      }
    }
  }

  @Action
  public addDesktopApp(app: IDesktopSingleApp | null) {
    this.ADD_DESKTOP_APP(app)
  }
}

export const DesktopModule = getModule(Desktop)
