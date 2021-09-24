import { VuexModule, Module, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IAdminState {
  adminState: any
}

@Module({ dynamic: true, store, name: 'admin' })
class Admin extends VuexModule implements IAdminState {
  public adminState = null

  @Mutation
  public setAdminState(state: any) {
    this.adminState = state
  }
}

export const AdminModule = getModule(Admin)
