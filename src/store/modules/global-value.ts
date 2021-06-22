import { VuexModule, Module, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IGlobalValueState {
  originUrl: string
  slug: string
  closePageAutoLogout: boolean
}

@Module({ dynamic: true, store, name: 'global' })
class GlobalValue extends VuexModule implements IGlobalValueState {
  public originUrl: string = ''
  public slug: string = ''
  public closePageAutoLogout: boolean = false

  @Mutation
  setOriginUrl(url: string) {
    this.originUrl = url
  }

  @Mutation
  setSlug(slug: string) {
    this.slug = slug
  }

  @Mutation
  setClosePageAutoLogout(value: boolean) {
    this.closePageAutoLogout = value
  }

}

export const GlobalValueModule = getModule(GlobalValue)
