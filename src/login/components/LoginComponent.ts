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
    runWorkflowByClass(ButtonClick, { com: this, btn: btn })
  }
}
