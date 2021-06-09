import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IFlowState {
  stop: boolean
}

@Module({ dynamic: true, store, name: 'flow' })
class Flow extends VuexModule implements IFlowState {
  public stop = false

  @Mutation
  setFlowStatus(status: boolean) {
    this.stop = status
  }

}

export const FlowModule = getModule(Flow)
