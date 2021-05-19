import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import TablePageState from '@/admin/TablePage/TablePageState'

export interface ITenantState {
  tenantState: TablePageState
  currentTenant: any
  hasSlug: boolean
}

@Module({ dynamic: true, store, name: 'tenant' })
class Tenant extends VuexModule implements ITenantState {
  tenantState:TablePageState = {
    type: 'TablePage'
  }
  currentTenant: any = {}
  hasSlug: boolean = false

  @Mutation
  public changeState(payload: any) {
    this.tenantState = payload
  }

  @Mutation
  public changeCurrentTenant(payload: any) {
    this.currentTenant = payload
  }

  @Mutation
  public setHasSlug(hasSlug: boolean) {
    this.hasSlug = hasSlug
  }
}

export const TenantModule = getModule(Tenant)
