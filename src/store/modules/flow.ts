import { VuexModule, Module, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IFlowState {
  run: boolean
  data: { [ page: string ]: object }
}

@Module({ dynamic: true, store, name: 'flow' })
class Flow extends VuexModule implements IFlowState {
  public run = true
  public data = {}

  @Mutation
  stopRunFlow() {
    this.run = false
  }

  @Mutation
  startRunFlow() {
    this.run = true
  }

  @Mutation
  addPageData({ page, data }) {
    this.data[page] = data
  }

}

export const FlowModule = getModule(Flow)
