<template>
  <div class="auth-page">
    <el-form
      label-width="100px"
    >
      <el-form-item label="是否使用模板">
        <el-switch v-model="useTemplate" />
      </el-form-item>
      <template v-if="useTemplate">
        <el-form-item label="查看模板样式">
          <el-button
            type="text"
            @click="showAuthTemplate"
          >
            点击打开
          </el-button>
        </el-form-item>
        <el-form-item label="图标">
          <el-input
            v-model="template.icon"
            placeholder="请输入图标"
          />
        </el-form-item>
        <el-form-item label="标题">
          <el-input
            v-model="template.title"
            placeholder="请输入标题"
          />
        </el-form-item>
        <el-form-item label="授权信息">
          <Tinymce v-model="template.info" />
        </el-form-item>
        <el-form-item
          v-for="(item, index) in btnLabels"
          :key="index"
          :label="item"
        >
          <el-card>
            <el-form
              :model="template"
              label-width="80px"
            >
              <el-form-item label="文本">
                <el-input
                  v-model="template.btns[index].text"
                  placeholder="请输入按钮文本"
                />
              </el-form-item>
              <el-form-item label="颜色设置">
                文字颜色 <el-color-picker
                  v-model="template.btns[index].color"
                  class="set-color"
                />
                按钮颜色 <el-color-picker
                  v-model="template.btns[index].bgcolor"
                  class="set-color"
                />
              </el-form-item>
              <el-form-item label="长宽设置">
                长度 <el-input-number
                  v-model="template.btns[index].width"
                  placeholder="长度"
                />
                宽度 <el-input-number
                  v-model="template.btns[index].height"
                  placeholder="宽度"
                />
              </el-form-item>
            </el-form>
          </el-card>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="自定义HTML">
          <el-input
            v-model="html"
            type="textarea"
            :autosize="{minRows: 20}"
            placeholder="请输入Html内容"
          />
        </el-form-item>
      </template>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSave"
        >
          保存
        </el-button>
      </el-form-item>
    </el-form>
    <AuthTemplate ref="authtemplate" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Tinymce from '@/components/Tinymce/index.vue'
import AuthTemplate from './AuthTemplate.vue'
import AuthPageTemplate from './AuthPage'
import { runWorkflowByClass } from 'arkfbp/lib/flow'
import { Main as SaveAuthPage } from './flows/SaveAuthPage'
import { getToken } from '@/utils/auth'

@Component({
  name: 'Auth',
  components: {
    Tinymce,
    AuthTemplate
  }
})

export default class extends Vue {
  private btnLabels: Array<string> = ['确认按钮', '取消按钮']
  private useTemplate = false
  private html = ''
  private style = ''
  private template: AuthPageTemplate = {
    icon: '',
    title: '',
    info: '',
    btns: [
      {
        text: '',
        bgcolor: '',
        color: '',
        width: 0,
        height: 0
      },
      {
        text: '',
        bgcolor: '',
        color: '',
        width: 0,
        height: 0
      }
    ]
  }

  get tenant() {
    return this.$route.query.tenant
  }

  get app() {
    return this.$route.query.app
  }

  get authUrl() {
    return window.location.origin + this.$route.query.auth_url + '?token=' + getToken()
  }

  get url() {
    return '/api/v1/tenant/' + this.tenant + '/app/' + this.app + '/add_auth_tmpl/'
  }

  showAuthTemplate() {
    (this.$refs.authtemplate as Vue & { show: Function }).show()
  }

  getTemplateHtml() {
    const template = document.createElement('html')
    const head = document.createElement('head')
    head.innerHTML = '<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>应用授权</title>'
    const body = document.createElement('body')
    const auth = this.initAuthPage()
    body.appendChild(auth)
    const script = this.initScript()
    body.appendChild(script)
    const style = document.createElement('style')
    style.innerHTML = this.style
    head.appendChild(style)
    template.appendChild(head)
    template.appendChild(body)
    const page = '<html lang="en">' + template.innerHTML + '</html>'
    return page
  }

  initScript() {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    const code = `document.getElementsByClassName('agree')[0].onclick = function() {window.location.replace('${this.authUrl + '&name=allow'}');};document.getElementsByClassName('cancel')[0].onclick = function() {window.location.replace('${this.authUrl}')}`
    try {
      script.appendChild(document.createTextNode(code))
    } catch (e) {
      script.text = code
    }
    return script
  }

  initAuthPage() {
    const auth = this.createAuthElement('div', ['auth'], '.auth{width: 500px;height: auto;position: absolute;top: 30%;left: 50%;transform: translateX(-50%) translateY(-50%);background-color: #fff;padding: 15px;box-shadow: 0 2px 16px #D3CECE, 0 0 1px #D3CECE, 0 0 1px #D3CECE;}')
    const header = this.initAuthPageHeader()
    const info = this.initAuthPageInfo()
    const footer = this.initAuthPageBtns()
    auth.appendChild(header)
    auth.appendChild(info)
    auth.appendChild(footer)
    return auth
  }

  initAuthPageHeader() {
    const header = this.createAuthElement('div', ['header'], '.header{text-align: center;}')
    if (this.template.icon) {
      const icon = this.createAuthElement('img', ['icon'], '.icon{width: 60px;}')
      icon.setAttribute('src', this.template.icon)
      header.appendChild(icon)
    }
    if (this.template.title) {
      const title = this.createAuthElement('div', ['title'], '.title{font-size: 20px;font-weight: bold;}')
      title.innerHTML = this.template.title
      header.appendChild(title)
    }
    return header
  }

  initAuthPageInfo() {
    const info = this.createAuthElement('div', ['info'], '')
    info.innerHTML = this.template.info
    return info
  }

  initAuthPageBtns() {
    const footer = this.createAuthElement('div', ['footer'], '.footer{margin-top: 20px;}')
    const agreeBtn = this.createAuthElement('button', ['btn', 'agree'], `.btn{width: ${this.template.btns![0].width || 360}px;height: ${this.template.btns![0].height || 36}px;display: block;margin-bottom: 10px;position: relative;left: 50%;transform: translateX(-50%);border: 0px;cursor: pointer;}.agree{background-color: ${this.template.btns![0].bgcolor || 'rgb(177, 31, 31)'};color: ${this.template.btns![0].color || 'white'};}`)
    agreeBtn.innerHTML = this.template.btns![0].text || '授 权'
    const cancelBtn = this.createAuthElement('button', ['btn', 'cancel'], `.cancel{background-color: ${this.template.btns![1].bgcolor || ''};color: ${this.template.btns![1].color || ''};}`)
    cancelBtn.innerHTML = this.template.btns![1].text || '取 消'
    footer.appendChild(agreeBtn)
    footer.appendChild(cancelBtn)
    return footer
  }

  async onSave() {
    const html = this.useTemplate ? this.getTemplateHtml() : this.html
    await runWorkflowByClass(SaveAuthPage, {
      url: this.url,
      html: html
    })
  }

  createAuthElement(type: string, classNames: Array<string>, style: string) {
    const el = document.createElement(type)
    el.className = classNames.join(' ')
    this.style = this.style + style
    return el
  }
}
</script>

<style lang="scss" scoped>
.auth-page {
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  .set-color {
    vertical-align:middle;
    margin-right: 10px;
  }
  .el-form-item {
    margin-top: 10px;
  }
}
</style>
