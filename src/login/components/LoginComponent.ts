import Vue from 'vue'
import { Prop, Component, Watch } from 'vue-property-decorator'
import LoginButton from './LoginButton.vue'
import { LoginPagesConfig, LoginPageConfig, FormConfig, ButtonConfig, FormItemConfig } from '../interface'
import { runWorkflowByClass } from 'arkfbp/lib/flow'
import { Main as ButtonClick } from '../flows/ButtonClick'
import { Main as GetCode } from '../flows/GetCode'
import getBaseUrl from '@/utils/get-base-url'
import LoginStore from '../store/login'
import { RULES } from '@/utils/rules'

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
      RULES.password,
      { validator: this.checkPassword, trigger: 'blur' }
    ],
    username: [
      RULES.required
    ],
    mobile: [
      RULES.required
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

  async btnClickHandler(btn:ButtonConfig) {
    if (!btn.gopage && !btn.delay && !btn.redirect) {
      (this.$refs[this.pageData][this.currentFormIndex] as Vue & { validate: Function }).validate(async (valid: boolean) => {
        if (valid) {
          await runWorkflowByClass(ButtonClick, { com: this, btn: btn })
        }
      })
    } else {
      await runWorkflowByClass(ButtonClick, { com: this, btn: btn })
      if (btn.gopage) {
        this.resetFields()
        this.resetRules()
      }
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
        RULES.password,
        { validator: this.validateCheckPassword, trigger: 'blur' }
      ]
    } else {
      this.rules.password = [
        RULES.required
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
    await runWorkflowByClass(GetCode, {}).then((key: string) => {
      LoginStore.CodeFileName = key
      this.graphicCodeSrc = window.location.origin + getBaseUrl() + '/api/v1/authcode/render/' + LoginStore.CodeFileName
    })
  }

  hasGraphicCode(item: FormItemConfig) {
    const hasCode = item.name === 'code' && !item.append
    if (hasCode && this.graphicCodeSrc === '') {
      this.getGraphicCode()
    }
    return hasCode
  }

}
