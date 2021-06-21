import Vue from 'vue'
import Vuex from 'vuex'
import { IAppState } from './modules/app'
import { IUserState } from './modules/user'
import { ITagsViewState } from './modules/tags-view'
import { IErrorLogState } from './modules/error-log'
import { ISettingsState } from './modules/settings'
import { IAdminState } from './modules/admin'
import { IAccountState } from './modules/account'
import { ITenantState } from './modules/tenant'
import { IDesktopState } from './modules/desktop'
import { IValidateState } from './modules/validate'
import { IGlobalValueState } from './modules/global-value'

Vue.use(Vuex)

export interface IRootState {
  app: IAppState
  user: IUserState
  tagsView: ITagsViewState
  errorLog: IErrorLogState
  settings: ISettingsState
  admin: IAdminState
  account: IAccountState
  tenant: ITenantState
  desktop: IDesktopState
  validate: IValidateState
  globalValue: IGlobalValueState
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({})
