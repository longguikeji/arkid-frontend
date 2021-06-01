import Vue from 'vue'
import { Prop, Component } from 'vue-property-decorator'
import LoginButton from './LoginButton.vue'
import { LoginPagesConfig, LoginPageConfig, FormConfig, ButtonConfig, FormItemConfig } from '../interface'
import { runWorkflowByClass } from 'arkfbp/lib/flow'
import { Main as ButtonClick } from '../flows/ButtonClick'

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

  page = ''
  currentFormIndex = '0'
  formData = {}
  rules = {
    password: [
      { validator: this.validatePassword, trigger: 'blur' }
    ],
    repassword: [
      { validator: this.validatePassword, trigger: 'blur' }
    ],
    username: [
      { validator: this.validateUsername, trigger: 'blur' }
    ],
    mobile: [
      { validator: this.validateMobile, trigger: 'blur' }
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

  btnClickHandler(btn:ButtonConfig) {
    if (!btn.gopage) {
      (this.$refs[this.pageData][this.currentFormIndex] as Vue & { validate: Function }).validate((valid: boolean) => {
        if (valid) {
          runWorkflowByClass(ButtonClick, { com: this, btn: btn })
        }
      })
    } else {
      runWorkflowByClass(ButtonClick, { com: this, btn: btn })
    }
    this.resetFields()
  }

  handleTabClick() {
    this.resetFields()
  }

  resetFields() {
    this.$refs[this.pageData][this.currentFormIndex].resetFields()
  }

  validatePassword(rule: any, value: string, callback: Function) {
    const errorMsg = this.validatePasswordIntensity(value)
    if (errorMsg !== '') {
      callback(new Error(errorMsg))
    } else {
      if (rule.field === 'repassword' || rule.fullField === 'repassword') {
        const isPass = this.validateRepasswordIsPass(value)
        if (!isPass) {
          callback(new Error('两次输入的密码不同'))
        }
      }
      callback()
    }
  }

  validatePasswordIntensity(value: string): string {
    let errorMsg = ''
    if (!value) {
      errorMsg = '请输入密码'
    } else if (value.length < 8) {
      errorMsg = '密码长度应大于等于8位'
    } else if (/^([0-9]+)$/.test(value)) {
      errorMsg = '密码不能全为数字'
    }
    return errorMsg
  }

  validateRepasswordIsPass(value: string): boolean {
    let isPass = false
    if (value === this.currentFormData['password']) {
      return true
    }
    return isPass
  }

  validateUsername(rule: any, value: string, callback: Function) {
    if (value === '') {
      callback(new Error('请输入用户名'))
    } else {
      callback()
    }
  }

  validateMobile(rule: any, value: string, callback: Function) {
    if (!value) {
      callback(new Error('请输入手机号'))
    } else {
      const reg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号'))
      }
    }
  }
}
