import Vue from 'vue'
import { Prop, Component } from 'vue-property-decorator'
import LoginButton from './LoginButton.vue'
import { LoginPagesConfig, LoginPageConfig, FormConfig, ButtonConfig, FormItemConfig, TenantPasswordComplexity } from '../interface'
import LoginStore from '../store/login'
import { RULES, getRegexRule, DEFAULT_PASSWORD_COMPLEXITY } from '../util/rules'
import request from '../request'
import { error } from '@/constants/error'

@Component({
  name: 'LoginComponent',
  components: {
    LoginButton
  }
})
export default class LoginComponent extends Vue {
  @Prop({ required: true }) title?:string
  @Prop({ required: true }) icon?:string
  @Prop({ required: true }) config?:LoginPagesConfig
  @Prop({ required: true }) complexity?: TenantPasswordComplexity
  
  graphicCodeSrc: string = ''
  page = ''
  currentFormIndex = '0'
  formData = {}
  rules = {
    password: <any>[
      RULES.required
    ],
    checkpassword: [
      RULES.required,
      this.currentPasswordComplexity,
      { validator: this.checkPassword, trigger: 'blur' }
    ],
    username: [
      RULES.required,
      RULES.username
    ],
    mobile: [
      RULES.required,
      RULES.mobile
    ]
  }

  get pageData() {
    if (this.page === '') {
      for (const key in this.config) {
        this.page = key
        break
      }
    }
    return this.page
  }

  set pageData(value:string) {
    this.page = value
    this.$nextTick(() => {
      this.currentFormIndex = '0'
    })
  }

  created() {
    for (const p in this.config) {
      this.$set(this.formData, p, [])
      const _page = this.config[p]
      for (const f in _page.forms) {
        this.$set(this.formData[p], f, {})
        const _form:FormConfig = _page.forms[f]
        for (const i in _form.items) {
          const _item:FormItemConfig = _form.items[i]
          if (_item.name) this.$set(this.formData[p][f], _item.name, '')
        }
      }
    }

    const that = this
    window.document.onkeypress = async function(e:KeyboardEvent) {
      // console.log(e)
      if (e.code === 'Enter' && that.currentPage?.forms) {
        that.btnClickHandler(that.currentPage.forms[that.currentFormIndex].submit)
      }
    }
  }

  get isFullScreen() {
    if (document.body.clientWidth < 600) { return true }
    return false
  }

  get currentPage():LoginPageConfig | undefined {
    let re
    if (this.config) {
      re = this.config[this.pageData]
    }
    return re
  }

  get currentFormData() {
    return this.formData[this.pageData][this.currentFormIndex]
  }

  get currentPasswordComplexity() {
    let regex =  DEFAULT_PASSWORD_COMPLEXITY.regex
    let hint = DEFAULT_PASSWORD_COMPLEXITY.hint
    if (this.complexity?.regular) {
      regex = new RegExp(this.complexity?.regular)
      hint = this.complexity.title || ''
    }
    return getRegexRule(hint, regex)
  }

  async http(url: string, method: string, data?: any) {
    method = method.toLowerCase()
    const response = await request[method](url, data)
    return response
  }

  async btnClickHandler(btn:ButtonConfig) {
    if (btn.http || btn.delay) this.btnHttp(btn)
    if (btn.gopage) this.togglePage(btn)
    if (btn.redirect) this.redirect(btn)
  }

  btnHttp(btn: ButtonConfig) {
    (this.$refs[this.pageData][this.currentFormIndex] as Vue & { validate: Function }).validate(async (valid: boolean) => {
      if (valid) {
        await this.btnResponse(btn)
      }
    })
  }

  redirect(btn: ButtonConfig) {
    let redirectParams = ``
    const params = btn.redirect!.params
    for (const key in params) {
      redirectParams += `&${key}=${params[key]}`
    }
    redirectParams = redirectParams.substring(1)
    const url = btn.redirect!.url + '?' + redirectParams
    window.location.replace(url)
  }

  togglePage(btn: ButtonConfig) {
    this.pageData = btn.gopage!
    this.resetFields()
    this.resetRules()
  }

  async btnResponse(btn: ButtonConfig) {
    let { url, method, params } = btn.http!
    for (let key in params) {
      if (this.currentFormData.hasOwnProperty(key)) {
        params[key] = this.currentFormData[key]
      } else {
        if (key === 'code_filename') params[key] = LoginStore.CodeFileName
      }
    }
    const response = await this.http(url, method, params)
    const data = response.data
    if (data.error === '0' && data.data.token) {
      // set token
      LoginStore.token = data.data.token
      // 绑定用户与第三方账号
      if (LoginStore.ThirdUserID && LoginStore.BindUrl) {
        let data = 'user_id=' + LoginStore.ThirdUserID
        if (LoginStore.hasToken()) {
          data += '&token=' + LoginStore.token
        }
        await this.http(url, method, data)
        LoginStore.BindUrl = ''
        LoginStore.ThirdUserID = ''
      }
      // next url
      if (LoginStore.NextUrl) {
        window.location.href = LoginStore.NextUrl + '&token=' + LoginStore.token
        LoginStore.NextUrl = ''
      } else {
        window.location.reload()
      }
    } else {
      if (data.is_need_refresh && LoginStore.CodeFileName === '') {
        window.location.reload()
      }
      this.$message({
        message: error[data.error] || data.message || 'error',
        type: 'error',
        showClose: true
      })
    }
  }

  handleTabClick() {
    this.resetFields()
  }

  resetFields() {
    this.$nextTick(() => {
      this.$refs[this.pageData][this.currentFormIndex].resetFields()
    })
  }

  resetRules() {
    if (this.page === 'register') {
      this.rules.password = [
        RULES.required,
        this.currentPasswordComplexity,
        { validator: this.validateCheckPassword, trigger: 'blur' }
      ]
    } else {
      this.rules.password = [
        RULES.required,
      ]
    }
  }

  validateCheckPassword(rule: any, value: string, callback: Function) {
    if (this.currentFormData['checkpassword']) {
      this.$refs[this.pageData][this.currentFormIndex].validateField('checkpassword')
    }
    callback()
  }

  checkPassword(rule: any, value: string, callback: Function) {
    if (value !== this.currentFormData['password']) {
      callback(new Error('两次输入的密码不同'))
    } else {
      callback()
    }
  }

  onBlur(event: Event, name: string) {
    this.$refs[this.pageData][this.currentFormIndex].validateField(name)
  }

  async getGraphicCode() {
    const url = '/api/v1/authcode/generate'
    const method = 'get'
    const response = await this.http(url, method)
    const data = response.data
    if (!data.error) {
      const { key, base64 } = data
      LoginStore.CodeFileName = key
      this.graphicCodeSrc = `data:image/png;base64,${base64}`
    }  
  }

  hasGraphicCode(item: FormItemConfig) {
    const hasCode = item.name === 'code' && !item.append
    if (hasCode && this.graphicCodeSrc === '') {
      this.getGraphicCode()
    }
    return hasCode
  }

  onPaste(e, name: string) {
    if (name.includes('password')) {
      e.preventDefault()
      return false
    }
  }
}
