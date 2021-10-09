import Vue from 'vue'
import Vuex from 'vuex'
import { IAppState } from './modules/app'
import { IUserState } from './modules/user'
import { ITagsViewState } from './modules/tags-view'
import { ISettingsState } from './modules/settings'
import { IAdminState } from './modules/admin'
import { ITenantState } from './modules/tenant'
import { IDesktopState } from './modules/desktop'
import { IValidateState } from './modules/validate'
import { IConfigState } from './modules/config'

Vue.use(Vuex)

export interface IRootState {
  app: IAppState
  user: IUserState
  tagsView: ITagsViewState
  settings: ISettingsState
  admin: IAdminState
  tenant: ITenantState
  desktop: IDesktopState
  validate: IValidateState
  config: IConfigState
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({})
