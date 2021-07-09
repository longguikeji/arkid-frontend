import { VuexModule, Module, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { DEFAULT_PASSWORD_COMPLEXITY } from '@/login/util/rules'

export interface IValidatorStrategy {
  regex?: RegExp
  hint?: string
}

export interface IGlobalValueState {
  originUrl: string
  slug: string
  closePageAutoLogout: boolean
  uploadFileFormat: string[]
  needCompleteProfileAfterRegister: boolean
  passwordComplexity: IValidatorStrategy
}

@Module({ dynamic: true, store, name: 'global' })
class GlobalValue extends VuexModule implements IGlobalValueState {
  public originUrl: string = ''
  public slug: string = ''
  public closePageAutoLogout: boolean = false
  public uploadFileFormat: string[] = []
  public needCompleteProfileAfterRegister: boolean = false
  public passwordComplexity: IValidatorStrategy = {
    regex: DEFAULT_PASSWORD_COMPLEXITY.regex,
    hint: DEFAULT_PASSWORD_COMPLEXITY.hint
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
  setGlobalConfig(data) {
    this.closePageAutoLogout = data.close_page_auto_logout || false
    this.uploadFileFormat = data.upload_file_format || []
    this.needCompleteProfileAfterRegister = data.need_complete_profile_after_register || false
  }

  @Mutation
  setPasswordComplexify(data) {
    this.passwordComplexity.regex = new RegExp(data.regular || '')
    this.passwordComplexity.hint = data.title || ''
  }

}

export const GlobalValueModule = getModule(GlobalValue)
