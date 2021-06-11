import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IAdminState {
  adminState: any
}

@Module({ dynamic: true, store, name: 'admin' })
class Admin extends VuexModule implements IAdminState {
  public adminState: any = null

  @Mutation
  public CHANGE_ADMIN(payload: any) {
    this.adminState = payload
  }

  @Action
  public async setAdmin(payload: any) {
    this.CHANGE_ADMIN(payload)
  }
}

export const AdminModule = getModule(Admin)
