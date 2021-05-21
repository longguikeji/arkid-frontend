import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { getDesktopApp, setDesktopApp, removeDesktopApp } from '@/utils/cookies'
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
  public desktopVisitedApps: Array<IDesktopSingleApp | null> = this.visitedApps

  private get visitedApps(): Array<IDesktopSingleApp | null> {
    const visitedApps: Array<IDesktopSingleApp | null> = []
    const localApp = getDesktopApp()
    if (localApp) {
      visitedApps.push(JSON.parse(localApp))
    }
    return visitedApps
  }

  @Mutation
  private ADD_DESKTOP_APP(app: IDesktopSingleApp) {
    let isAddApp = true
    for (let i = 0; i < this.desktopVisitedApps.length; i++) {
      const oneApp = this.desktopVisitedApps[i]
      if (oneApp?.url === app.url || oneApp?.name === app.name) {
        isAddApp = false
        break
      }
    }
    if (isAddApp) {
      setDesktopApp(JSON.stringify(app))
      this.desktopVisitedApps.push(app)
    }
  }

  @Mutation
  private REMOVE_DESKTOP_APP() {
    removeDesktopApp()
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
