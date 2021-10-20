import { VuexModule, Module, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IFlowState {
  run: boolean
}

@Module({ dynamic: true, store, name: 'flow' })
class Flow extends VuexModule implements IFlowState {
  public run = true

  @Mutation
  stopRunFlow() {
    this.run = false
  }

  @Mutation
  startRunFlow() {
    this.run = true
  }

}

export const FlowModule = getModule(Flow)
