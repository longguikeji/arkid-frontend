<template>
  <el-card>
    <div slot="header">
      设置密码
    </div>
    <el-form
      ref="passwordFormCom"
      :model="formData"
      status-icon
      :rules="rules"
      label-width="100px"
    >
      <el-form-item
        v-if="state.hasOldPassword"
        label="原密码"
        prop="oldPassword"
      >
        <el-input
          v-model="formData.oldPassword"
          placeholder="请输入原密码"
          type="password"
          autocomplete="off"
          show-password
          @copy.native.capture.prevent="onCopy"
        />
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
      >
        <el-input
          v-model="formData.password"
          placeholder="请输入密码"
          type="password"
          autocomplete="off"
          show-password
          @copy.native.capture.prevent="onCopy"
        />
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="checkPassword"
      >
        <el-input
          v-model="formData.checkPassword"
          placeholder="请再次输入密码"
          type="password"
          autocomplete="off"
          show-password
          @copy.native.capture.prevent="onCopy"
        />
      </el-form-item>
      <div class="password-buttons">
        <el-button @click="resetPasswordForm">
          重置
        </el-button>
        <el-button
          type="primary"
          @click="submitPasswordForm"
        >
          确认
        </el-button>
      </div>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import PasswordState from './PasswordState'
import BaseVue from '@/admin/base/BaseVue'
import { getPasswordRule } from '@/utils/rules'
import { RULES } from '@/login/utils/rules'

@Component({
  name: 'Password',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): PasswordState {
    return this.$state as PasswordState
  }

  private formData = {
    oldPassword: '',
    password: '',
    checkPassword: ''
  }

  private rules = {
    oldPassword: [
      RULES.required
    ],
    password: [
      RULES.required,
      getPasswordRule(),
      { validator: this.validateCheckPassword, trigger: 'blur' }
    ],
    checkPassword: [
      RULES.required,
      getPasswordRule(),
      { validator: this.checkSecondPassword, trigger: 'blur' }
    ]
  }

  private validateCheckPassword(rule: any, value: string, callback: Function) {
    if (this.formData.checkPassword) {
      (this.$refs.passwordFormCom as Vue & { validateField: Function }).validateField('check_password')
    }
    callback()
  }

  private checkSecondPassword(rule: any, value: string, callback: Function) {
    if (value !== this.formData.password) {
      callback(new Error('两次输入的密码不同'))
    } else {
      callback()
    }
  }

  submitPasswordForm() {
    (this.$refs.passwordFormCom as Vue & { validate: Function }).validate(async(valid: boolean) => {
      if (valid && this.state.action) {
        await this.runAction(this.state.action)
      }
    })
  }

  resetPasswordForm() {
    (this.$refs.passwordFormCom as Vue & { resetFields: Function }).resetFields()
  }

  onCopy() {
    return false
  }
}
</script>

<style lang="scss" scoped>
.password-buttons {
  display: flex;
  justify-content: center;
}
</style>
