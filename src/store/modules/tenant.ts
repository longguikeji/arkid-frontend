import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import TablePageState from '@/admin/TablePage/TablePageState'

export interface ITenantState {
  tenantState: TablePageState
  currentTenant: any
}

interface ITenant {
  uuid: string
  name?: string
  slug?: string
  icon?: string
  created?: string
}

@Module({ dynamic: true, store, name: 'tenant' })
class Tenant extends VuexModule implements ITenantState {
  tenantState:TablePageState = {
    type: 'TablePage'
  }
  currentTenant: ITenant = {
    uuid: ''
  }

  @Mutation
  public changeState(payload: any) {
    this.tenantState = payload
  }

  @Mutation
  public changeCurrentTenant(payload: any) {
    this.currentTenant = payload
  }
  
}

export const TenantModule = getModule(Tenant)
