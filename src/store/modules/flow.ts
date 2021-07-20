import { VuexModule, Module, Mutation, getModule } from 'vuex-module-decorators'
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
  addUrl({ page, url, value }) {
    this.urls[page] = {}
    this.urls[page][url] = value
  }

}

export const FlowModule = getModule(Flow)
