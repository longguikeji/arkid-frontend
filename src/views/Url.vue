<template>
  <div :class="prefixCls">
    <el-dialog
      :visible="true"
      :show-close="false"
      center
      width="500px"
      :modal="false"
      :fullscreen="fullscreen"
      :style="bgStyle"
    >
      <div
        slot="title"
        class="title"
      >
        <img
          :src="icon"
          alt=""
        >
        <div>{{ name }}</div>
      </div>
      <el-tabs stretch>
        <el-tab-pane label="访问地址">
          <el-form
            ref="urlForm"
            :model="form"
            :rules="rules"
          >
            <el-form-item prop="url">
              <el-input
                v-model="form.url"
                placeholder="请输入访问地址"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="submitForm('urlForm')"
              >
                点击提交
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { runFlowByFile } from '@/arkfbp/index'
import { RULES } from '../login/utils/rules'
import { TenantModule } from '@/store/modules/tenant'

@Component({
  name: 'Url'
})
export default class Url extends Vue {
  prefixCls = 'app-url'
  bgimage = require('../assets/bgc.png')
  logo = require('../assets/logo.png')
  form = { url: '' }
  rules = { url: [RULES.required] }

  get icon() {
    return TenantModule.currentTenant?.icon || this.logo
  }

  get name() {
    return TenantModule.currentTenant?.name
  }

  get fullscreen() {
    return document.body.clientWidth < 600
  }

  get bgStyle() {
    const { background_url: bgUrl } = TenantModule.currentTenant || {}
    return bgUrl
      ? {
        backgroundImage: `url(${bgUrl})`
      }
      : {
        backgroundImage: `url(${this.bgimage})`,
        backgroundColor: '#0f62ea'
      }
  }

  submitForm(formName: string) {
    const ref = this.$refs[formName] as any
    if (!ref) return
    ref.validate(async(valid: boolean) => {
      if (valid) {
        await runFlowByFile('flows/url', { url: this.form.url })
      } else {
        return false
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.app-url {
  width: 100%;
  height: 100%;
  background-image: url('../assets/bgc.png');
  background-color: rgb(15, 98, 234);
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 0 auto;

  ::v-deep .el-dialog__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  ::v-deep .el-dialog {
    margin: 0px !important;
    .el-dialog__header {
      border-radius: 8px 8px 0 0;
      padding: 0px;
    }
    .el-dialog__body {
      border-radius: 8px;
      padding: 0 50px 50px 50px;
    }
  }

  ::v-deep .el-button {
    width: 100%;
  }

  .title {
    padding: 50px 0 10px 50px;
    text-align: left;
    color: #303133;
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: bold;
    img {
      width: 48px;
      height: 48px;
      display: block;
      margin-bottom: 8px;
    }
  }
}
</style>
