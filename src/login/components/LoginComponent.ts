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
      { validator: this.validateRepassword, trigger: 'blur' }
    ],
    username: [
      { required: true, message: '用户名为必填项', trigger: 'blur' }
    ],
    mobile: [
      { required: true, message: '手机号为必填项', trigger: 'blur' }
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
      if (btn.gopage) this.resetFields()
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

  validatePassword(rule: any, value: string, callback: Function) {
    if (this.pageData === 'register') {
      const errorMsg = this.validatePasswordIntensity(value)
      if (errorMsg !== '') {
        callback(new Error(errorMsg))
      } else {
        if (this.currentFormData['repassword']) {
          this.$refs[this.pageData][this.currentFormIndex].validateField('repassword')
        }
        callback()
      }
    } else {
      callback()
    }
  }

  validateRepassword(rule: any, value: string, callback: Function) {
    const errorMsg = this.validatePasswordIntensity(value)
    if (errorMsg !== '') {
      callback(new Error(errorMsg))
    } else if (value !== this.currentFormData['password']) {
      callback(new Error('两次输入的密码不同'))
    } else {
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

  onBlur(event: Event, name: string) {
    this.$refs[this.pageData][this.currentFormIndex].validateField(name)
  }

}
