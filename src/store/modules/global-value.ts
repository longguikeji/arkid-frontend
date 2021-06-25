import { VuexModule, Module, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IPasswordComplexity {
  regex: RegExp
  isApply: boolean
  hint: string
}

interface IUploadFileFormat {
  regex: RegExp
  hint: string
}

export interface IGlobalValueState {
  originUrl: string
  slug: string
  closePageAutoLogout: boolean
  uploadFileFormat: string[]
  passwordComplexity: IPasswordComplexity
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
  public passwordComplexity: IPasswordComplexity = {
    regex: new RegExp(''),
    isApply: true,
    hint: ''
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
    this.passwordComplexity = {
      regex: eval(`/${data.regular}/`),
      isApply: data.is_apply,
      hint: data.title
    }
  }

}

export const GlobalValueModule = getModule(GlobalValue)
