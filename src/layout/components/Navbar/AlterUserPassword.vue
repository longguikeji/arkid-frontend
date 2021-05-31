<template>
  <el-dialog
    title="修改密码"
    :visible.sync="dialogVisible"
    width="60%"
  >
    <el-form
      ref="alterUserPasswordForm"
      :model="formData"
      :rules="rules"
      label-width="130px"
      :append-to-body="true"
    >
      <el-form-item
        label="用户UUID"
        prop="uuid"
      >
        <span>{{ formData.uuid }}</span>
      </el-form-item>
      <el-form-item
        label="输入新密码"
        prop="password"
      >
        <el-input
          v-model="formData.password"
          placeholder="输入新密码"
          show-password
        />
      </el-form-item>
      <el-form-item
        label="再次输入新密码"
        prop="checkpassword"
      >
        <el-input
          v-model="formData.checkpassword"
          placeholder="再次输入新密码"
          show-password
        />
      </el-form-item>
      <el-form-item class="alter-user-password-btns">
        <el-button
          type="primary"
          class="submit"
          @click="toAlterUserPassword"
        >
          确定
        </el-button>
        <el-button
          class="cancel"
          @click="cancelAlterUserPassword"
        >
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { runFlowByFile } from '@/arkfbp/index'

@Component({
  name: 'AlterUserPassword'
})

export default class extends Vue {
  private dialogVisible = false

  private formData = {
    uuid: '',
    password: '',
    checkpassword: ''
  }

  private rules = {
    password: [
      { required: true, validator: this.validatePassword, trigger: 'blur' }
    ],
    checkpassword: [
      { required: true, validator: this.validateCheckPassword, trigger: 'blur' }
    ]
  }

  private validatePassword(rule, value, callback) {
    if (value === '') {
      callback(new Error('请输入密码'))
    } else {
      callback()
    }
  }

  private validateCheckPassword(rule, value, callback) {
    if (value === '') {
      callback(new Error('请再次输入密码'))
    } else if (value !== this.formData.password) {
      callback(new Error('两次输入密码不一致!'))
    } else {
      callback()
    }
  }

  private toAlterUserPassword() {
    (this.$refs.alterUserPasswordForm as Vue & {validate:Function}).validate(async(valid: boolean) => {
      if (valid) {
        await runFlowByFile('flows/user/alterPassword', {
          params: {
            uuid: this.formData.uuid,
            password: this.formData.password
          }
        }).then(() => {
          this.dialogVisible = false
          this.$message({
            message: '修改密码成功',
            type: 'success',
            showClose: true
          })
        })
      }
    })
  }

  private cancelAlterUserPassword() {
    this.dialogVisible = false
  }

  private show() {
    this.dialogVisible = true
    this.formData.uuid = UserModule.uuid
  }
}
</script>

<style lang="scss" scoped>
.alter-user-password-btns {
  .cancel {
    float: right;
    margin-right: 20px;
  }
  .submit {
    float: right;
  }
}
</style>
