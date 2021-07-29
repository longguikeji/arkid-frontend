import Vue from 'vue'
import { Prop, Component } from 'vue-property-decorator'
import LoginButton from './LoginButton.vue'
import { LoginPagesConfig, LoginPageConfig, FormConfig, ButtonConfig, FormItemConfig, TenantPasswordComplexity } from '../interface'
import LoginStore from '../store/login'
import { RULES, getRegexRule, DEFAULT_PASSWORD_RULE } from '../util/rules'
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
  @Prop({ required: true, default: {} }) complexity!: TenantPasswordComplexity

  imageCodeSrc: string = ''
  forms: object = {}
  page: string = ''
  tabIndex: string = '0'
  rules: object = {}
  agreementVisible: boolean = false
  btn: ButtonConfig = {}

  get fullscreen(): boolean {
    return document.body.clientWidth < 600
  }

  get pageConfig(): LoginPageConfig | undefined {
    return this.config ? this.config[this.page] : undefined
  }

  get form() {
    return this.forms[this.page][this.tabIndex]
  }

  get passwordRule() {
    const { regular, title } = this.complexity
    const regex = regular ? new RegExp(regular) : DEFAULT_PASSWORD_RULE.regex
    const hint = title || DEFAULT_PASSWORD_RULE.hint
    return getRegexRule(hint, regex)
  }

  created() {
    this.initPage()
    this.processConfig()
    this.addKeyPressEvent()
  }

  handleTabClick() {
    this.resetFields()
  }

  async http(url: string, method: string, data?: any) {
    method = method.toLowerCase()
    return await request[method](url, data)
  }

  initPage() {
    this.page = this.config ? Object.keys(this.config)[0] : ''
  }

  processConfig() {
    for (const p in this.config) {
      this.$set(this.forms, p, [])
      const _page = this.config[p]
      for (const f in _page.forms) {
        this.$set(this.forms[p], f, {})
        const _form: FormConfig = _page.forms[f]
        for (const i in _form.items) {
          const _item: FormItemConfig = _form.items[i]
          if (_item.name) {
            this.$set(this.forms[p][f], _item.name, '')
            this.addRule(_item.name)
          }
        }
      }
    }
  }

  addRule(name: string) {
    this.$set(this.rules, name, [ RULES.required ])
    if (RULES[name]) this.rules[name].push(RULES[name])
    if (name === 'checkpassword') {
      Array.prototype.push.apply(this.rules[name], [ this.passwordRule,
        { validator: this.checkPassword, trigger: 'blur' } ])
    }
  }

  addKeyPressEvent() {
    const that = this
    window.document.onkeypress = async function(e:KeyboardEvent) {
      if (e.code === 'Enter' && that.pageConfig?.forms) {
        that.btnClickHandler(that.pageConfig.forms[that.tabIndex].submit)
      }
    }
  }

  onPaste(e: Event, name: string) {
    if (name.includes('password')) {
      e.preventDefault()
      return false
    }
  }

  resetFields() {
    this.$nextTick(() => {
      this.$refs[`${this.page}${this.tabIndex}`][0].resetFields()
    })
  }

  resetRules() {
    if (this.page === 'register') {
      this.$set(this.rules, 'password', [
        RULES.required,
        this.passwordRule,
        { validator: this.validateCheckPassword, trigger: 'blur' }
      ])
    } else {
      this.$set(this.rules, 'password', [
        RULES.required
      ])
    }
  }

  validateCheckPassword(rule: any, value: string, callback: Function) {
    if (this.form['checkpassword']) {
      this.$refs[`${this.page}${this.tabIndex}`][0].validateField('checkpassword')
    }
    callback()
  }

  checkPassword(rule: any, value: string, callback: Function) {
    if (value !== this.form['password']) {
      callback(new Error('两次输入的密码不同'))
    } else {
      callback()
    }
  }

  isNeedImageCode(item: FormItemConfig) {
    const hasCode = item.name === 'code' && !item.append && this.page === 'login'
    if (hasCode && this.imageCodeSrc === '') {
      this.getImageCode()
    }
    return hasCode
  }

  async getImageCode() {
    const response = await this.http('/api/v1/authcode/generate', 'get')
    const data = response.data
    if (!data.error) {
      const { key, base64 } = data
      LoginStore.CodeFileName = key
      this.imageCodeSrc = `data:image/png;base64,${base64}`
    }  
  }

  async btnClickHandler(btn: ButtonConfig) {
    this.btn = btn
    if (btn.http) this.btnHttp()
    if (btn.gopage) this.goPage()
    if (btn.redirect) this.redirect()
    if (btn.delay) await this.btnRequest()
  }

  btnHttp() {
    (this.$refs[`${this.page}${this.tabIndex}`][0] as Vue & { validate: Function }).validate(async (valid: boolean) => {
      if (valid) {
        await this.btnRequest()
      }
    })
  }

  goPage() {
    if (this.btn.agreement) {
      this.agreementVisible = true
    } else {
      this.switchPage()
    }
  }

  switchPage() {
    this.page = this.btn.gopage!
    this.tabIndex = '0'
    this.resetRules()
    this.resetFields()
  }

  redirect() {
    let redirectParams = ``
    const params = this.btn.redirect!.params
    for (const key in params) {
      redirectParams += `&${key}=${params[key]}`
    }
    redirectParams = redirectParams.substring(1)
    const url = this.btn.redirect!.url + '?' + redirectParams
    window.location.replace(url)
  }

  agree() {
    this.agreementVisible = false
    this.switchPage()
  }

  async btnRequest() {
    let { url, method, params } = this.btn.http!
    for (let key in params) {
      if (this.form.hasOwnProperty(key)) {
        params[key] = this.form[key]
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
        const parmas = {
          user_id: LoginStore.ThirdUserID
        }
        url = LoginStore.BindUrl
        method = 'post'
        await this.http(url, method, parmas)
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
        type: data.error && data.error !== '0' ? 'error' : 'success',
        showClose: true
      })
    }
  }
}