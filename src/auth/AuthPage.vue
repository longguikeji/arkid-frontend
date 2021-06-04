<template>
  <div class="auth-page">
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
    >
      <el-form-item label="图标">
        <el-input
          v-model="form.icon"
          placeholder="请输入图标"
        />
      </el-form-item>
      <el-form-item label="标题">
        <el-input
          v-model="form.title"
          placeholder="请输入标题"
        />
      </el-form-item>
      <el-form-item label="授权信息">
        <textarea v-model="form.info" />
      </el-form-item>
      <el-form-item
        v-for="(item, index) in 2"
        :key="index"
        :label="btnLabels[index]"
      >
        <el-card>
          <el-form
            ref="form2"
            :model="form"
            label-width="80px"
          >
            <el-form-item label="文本">
              <el-input
                v-model="form.icon"
                placeholder="请输入按钮文本"
              />
            </el-form-item>
            <el-form-item label="颜色设置">
              文字颜色 <el-color-picker
                v-model="form.icon"
                class="set-color"
              />
              按钮颜色 <el-color-picker
                v-model="form.icon"
                class="set-color"
              />
            </el-form-item>
            <el-form-item label="长宽设置">
              长度 <el-input-number
                v-model="form.width"
                placeholder="长度"
              />
              宽度 <el-input-number
                v-model="form.width"
                placeholder="宽度"
              />
            </el-form-item>
          </el-form>
        </el-card>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSave"
        >
          保存
        </el-button>
        <el-button
          type="primary"
          @click="onPreview"
        >
          预览
        </el-button>
      </el-form-item>
    </el-form>
    <div
      id="preview"
      v-html="content"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import Tinymce from '@/components/Tinymce/index.vue'
import { runWorkflowByClass } from 'arkfbp/lib/flow'
import { Main as SaveAuthPage } from './flows/SaveAuthPage'

@Component({
  name: 'Auth',
  components: {
    Tinymce
  }
})

export default class extends Vue {
  content = ''
  form = {
    title: '',
    icon: '',
    info: '',
    width: ''
  }

  btnLabels = ['确认按钮', '取消按钮']

  onPreview() {
    const preview = document.getElementById('preview')
    preview?.scrollIntoView()
  }

  async onSave() {
    await runWorkflowByClass(SaveAuthPage, {
      url: '/api/v1/tenant/a8d6968704f24c358663b5541a4c037e/app/6c8b128530ea4023bed574bb33f8d1c8/add_auth_tmpl/',
      html: this.form.info
    })
    // this.initAuthPageTitle()
    // this.initAuthPageIcon()
    // this.initAuthPageInfo()
    // this.initAuthPageArgeeBtn()
    // this.initAuthPageCancelBtn()
    // this.requestSaveAuthPage()
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

  requestSaveAuthPage() {
    console.log('requestSaveAuthPage')
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
