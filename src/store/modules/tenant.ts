import { VuexModule, Module, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'

export interface ITenantState {
  tenantState: AdminComponentState
  currentTenant: any
}

interface ITenant {
  uuid?: string
  name?: string
  slug?: string
  icon?: string
  created?: string
}

@Module({ dynamic: true, store, name: 'tenant' })
class Tenant extends VuexModule implements ITenantState {
  tenantState: AdminComponentState = {
    type: 'TablePage'
  }
  currentTenant: ITenant = {}

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
