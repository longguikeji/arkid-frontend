import { VuexModule, Module, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IGlobalValueState {
  originUrl: string
  slug: string
}

@Module({ dynamic: true, store, name: 'flow' })
class GlobalValue extends VuexModule implements IGlobalValueState {
  public originUrl: string = ''
  public slug: string = ''

  @Mutation
  setOriginUrl(url: string) {
    this.originUrl = url
  }

  @Mutation
  setSlug(slug: string) {
    this.slug = slug
  }

}

export const GlobalValueModule = getModule(GlobalValue)
