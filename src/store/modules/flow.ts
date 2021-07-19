import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IFlowState {
  run: boolean
  urls: { [page: string]: { [key: string]: string } }
}

@Module({ dynamic: true, store, name: 'flow' })
class Flow extends VuexModule implements IFlowState {
  public run = true
  public urls = {}

  @Mutation
  stopRunFlow() {
    this.run = false
  }

  @Mutation
  startRunFlow() {
    this.run = true
  }

  @Mutation
  addUrl({ url, value }) {
    this.urls[url] = value
  }

}

export const FlowModule = getModule(Flow)
