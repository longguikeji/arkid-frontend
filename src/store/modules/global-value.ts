import { VuexModule, Module, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { DEFAULT_PASSWORD_RULE } from '@/login/util/rules'

export interface IValidatorStrategy {
  regex?: RegExp
  hint?: string
}

export interface IGlobalValueState {
  originUrl: string
  slug: string
  closePageAutoLogout: boolean
  uploadFileFormat: string[]
  passwordComplexity: IValidatorStrategy
}

interface IGlobalConfig {
  upload_file_format: string[]
  close_page_auto_logout: boolean
}

@Module({ dynamic: true, store, name: 'global' })
class GlobalValue extends VuexModule implements IGlobalValueState {
  public originUrl: string = ''
  public slug: string = ''
  public closePageAutoLogout: boolean = false
  public uploadFileFormat: string[] = []
  public passwordComplexity: IValidatorStrategy = {
    regex: DEFAULT_PASSWORD_RULE.regex,
    hint: DEFAULT_PASSWORD_RULE.hint
  }

  @Mutation
  setOriginUrl(url: string) {
    this.originUrl = url
  }

  @Mutation
  setSlug(slug: string) {
    this.slug = slug
  }

  @Mutation
  setGlobalConfig(data: IGlobalConfig) {
    this.closePageAutoLogout = data.close_page_auto_logout || false
    this.uploadFileFormat = data.upload_file_format || []
  }

  @Mutation
  setPasswordComplexify(data) {
    this.passwordComplexity.regex = new RegExp(data.regular || '')
    this.passwordComplexity.hint = data.title || ''
  }

}

export const GlobalValueModule = getModule(GlobalValue)
