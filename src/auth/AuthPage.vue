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
    return this.$route.query.auth_url
  }

  showAuthTemplate() {
    (this.$refs.authtemplate as Vue & { show: Function }).show()
  }

  getTemplateHtml() {
    const template = document.createElement('html')
  }

  initAuthPageTitle() {
    console.log('init')
  }

  initAuthPageIcon() {
    console.log('init')
  }

  initAuthPageInfo() {
    console.log('init')
  }

  initAuthPageArgeeBtn() {
    console.log('init')
  }

  initAuthPageCancelBtn() {
    console.log('init')
  }

  async onSave() {
    await runWorkflowByClass(SaveAuthPage, {
      url: '/api/v1/tenant/a8d6968704f24c358663b5541a4c037e/app/6c8b128530ea4023bed574bb33f8d1c8/add_auth_tmpl/',
      html: this.useTemplate ? this.getTemplateHtml() : this.html
    })
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
