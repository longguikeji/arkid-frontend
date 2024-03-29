import Vue from 'vue'
import { Prop, Component } from 'vue-property-decorator'
import LoginButton from './LoginButton.vue'
import {
  LoginPagesConfig,
  LoginPageConfig,
  FormConfig,
  ButtonConfig,
  FormItemConfig,
  LoginTenant,
} from '../interface'
import LoginStore from '../store'
import { RULES, getRegexRule, DEFAULT_PASSWORD_RULE } from '../utils/rules'
import http from '../utils/http'
import { error } from '@/constants/error'

@Component({
  name: 'LoginComponent',
  components: {
    LoginButton,
  },
})
export default class LoginComponent extends Vue {
  @Prop({ required: false }) tenant?: LoginTenant
  @Prop({ required: true }) config?: LoginPagesConfig

  imageCodeSrc: string = ''
  forms: object = {}
  page: string = ''
  tabIndex: string = '0'
  rules: object = {}
  agreementVisible: boolean = false
  btn: ButtonConfig = {}
  isChangeDelay: boolean = false
  defaultIcon = require('../../assets/logo.png')
  defaultBgImg = require('../../assets/bgc.png')

  get name() {
    return this.tenant?.name
  }

  get icon() {
    return this.tenant?.icon || this.defaultIcon
  }

  get complexity() {
    return this.tenant?.password_complexity
  }

  get loginBgStyle() {
    const bgUrl = this.tenant?.background_url
    return bgUrl
      ? {
          backgroundImage: `url(${bgUrl})`,
        }
      : {
          backgroundImage: `url(${this.defaultBgImg})`,
          backgroundColor: '#0f62ea',
        }
  }

  get copyright() {
    return this.tenant?.copyright_text
  }

  get fullscreen(): boolean {
    return document.body.clientWidth < 600
  }

  get form() {
    return this.forms[this.page][this.tabIndex]
  }

  get pageConfig(): LoginPageConfig | undefined {
    return this.config && this.page ? this.config[this.page] : undefined
  }

  get passwordRule() {
    const regex = this.complexity?.regular
      ? new RegExp(this.complexity.regular)
      : DEFAULT_PASSWORD_RULE.regex
    const hint = this.complexity?.title || DEFAULT_PASSWORD_RULE.hint
    return getRegexRule(hint, regex)
  }

  get tab(): string {
    return `${this.page}${this.tabIndex}`
  }

  get currentForm() {
    return this.$refs[this.tab] && this.$refs[this.tab]![0].$children[0]
  }

  created() {
    this.initPageName()
    this.processConfig()
    this.addKeyPressEvent()
  }

  handleTabClick() {
    this.resetFields()
    this.isChangeDelay = false
  }

  initPageName() {
    for (const key in this.config) {
      this.page = key
      break
    }
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
            this.$set(this.forms[p][f], _item.name, _item.value || '')
            this.addRule(_item.name)
          }
        }
      }
    }
  }

  addRule(name: string) {
    this.$set(this.rules, name, [RULES.required])
    if (RULES[name]) this.rules[name].push(RULES[name])
    if (name === 'checkpassword') {
      Array.prototype.push.apply(this.rules[name], [
        this.passwordRule,
        { validator: this.checkPassword, trigger: 'blur' },
      ])
    }
  }

  addKeyPressEvent() {
    const that = this
    window.onkeypress = async function(e: KeyboardEvent) {
      if (e.code === 'Enter' && that.pageConfig?.forms) {
        that.btnClickHandler(that.pageConfig.forms[that.tabIndex].submit)
      }
    }
  }

  onCopy(e: Event, name: string) {
    if (name.includes('password')) {
      e.preventDefault()
      return false
    }
  }

  resetFields() {
    this.$nextTick(() => {
      this.currentForm.resetFields()
    })
  }

  resetRules() {
    if (this.page === 'register') {
      this.$set(this.rules, 'password', [
        RULES.required,
        this.passwordRule,
        { validator: this.validateCheckPassword, trigger: 'blur' },
      ])
    } else {
      this.$set(this.rules, 'password', [RULES.required])
    }
  }

  validateCheckPassword(rule: any, value: string, callback: Function) {
    if (this.form['checkpassword']) {
      this.currentForm.validateField('checkpassword')
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
    this.$nextTick(() => {
      const hasCode =
        item.name === 'code' && !item.append && this.page === 'login'
      if (hasCode && this.imageCodeSrc === '') {
        this.getImageCode()
      }
      return hasCode
    })
  }

  async btnClickHandler(btn: ButtonConfig) {
    this.btn = btn
    if (btn.http && !btn.delay) this.btnHttpCheck()
    if (btn.gopage && !btn.http) this.goPage()
    if (btn.redirect) this.redirect()
    if (btn.delay) this.btnDelayCheck()
  }

  btnHttpCheck() {
    this.currentForm.validate(async (valid: boolean) => {
      if (valid) {
        await this.btnRequest()
      }
    })
  }

  btnDelayCheck() {
    const params = this.btn.http!.params
    const keys = Object.keys(params)
    this.currentForm.validateField(keys, async (err) => {
      if (!err) {
        await this.btnRequest()
      } else {
        this.$message({
          message: err,
          type: 'error',
          showClose: true,
        })
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

  switchPage(page?: string) {
    this.page = page || this.btn.gopage!
    this.tabIndex = '0'
    this.isChangeDelay = false
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

  getParams() {
    const params = this.btn.http!.params
    let submitParams = {}
    if (params) {
      for (const key in params) {
        if (this.form.hasOwnProperty(key)) {
          submitParams[key] = this.form[key]
        }
        if (key === 'code_filename') submitParams[key] = LoginStore.Captcha
      }
    } else {
      submitParams = this.form
    }
    return submitParams
  }

  async request(url: string, method: string, data?: any) {
    method = method.toLowerCase()
    return await http[method](url, data)
  }

  async getImageCode() {
    const response = await this.request('/api/v1/authcode/generate', 'get')
    const data = response.data
    if (!data.error) {
      const { key, base64 } = data
      LoginStore.Captcha = key
      this.imageCodeSrc = `data:image/png;base64,${base64}`
    }
  }

  async btnRequest() {
    let { url, method } = this.btn.http!
    const params = this.getParams()
    if (url.includes('tenant_uuid') && LoginStore.TenantUUID) {
      url = url.replace('tenant_uuid', LoginStore.TenantUUID)
    }
    const res = await this.request(url, method, params)
    if (res.status >= 300) return
    let {
      data,
      error: errorCode,
      message: msg,
      is_need_refresh: isRefresh,
      gopage,
    } = res?.data || {}
    if (errorCode === '0') {
      if (this.btn.delay) {
        this.$message.success({
          message: '验证码发送成功，请注意查收',
          showClose: true,
        })
        this.isChangeDelay = true
      }
      const token = data?.token || LoginStore.token
      if (!token) return
      LoginStore.token = token
      // 绑定用户与第三方账号
      if (LoginStore.ThirdUserID && LoginStore.BindUrl) {
        await this.request(LoginStore.BindUrl, 'post', {
          user_id: LoginStore.ThirdUserID,
        })
        LoginStore.BindUrl = ''
        LoginStore.ThirdUserID = ''
      }
      // 调转nextUrl或直接进入主页面
      if (LoginStore.NextUrl) {
        const prefix = LoginStore.NextUrl.includes('?') ? '&' : '?'
        window.location.href = LoginStore.NextUrl + `${prefix}token=` + LoginStore.token
        LoginStore.NextUrl = ''
      } else {
        window.location.reload()
      }
    } else {
      if (isRefresh && LoginStore.Captcha === '') {
        window.location.reload()
      }
      if (errorCode === '10029' && gopage) {
        LoginStore.token = data?.token
        this.switchPage(gopage)
      }
      msg = error[errorCode] || msg
      if (msg) this.$message.error({ message: msg, showClose: true })
    }
  }
}
