import * as api from '@/services/oneid'
import { FORM_RULES } from '@/utils'
import { Form } from 'iview'
import {Component, Prop, Vue} from 'vue-property-decorator'
import './ResetPassword.less'

@Component({
  template: html`
  <Modal v-model="showModal">
    <div class="ui-reset-password">
      <div class="ui-reset-password--header">设置/修改登录密码</div>
      <Form
        :label-width="150"
        style="margin-right: 80px;"
        :model="passwordForm"
        ref="passwordForm"
        :rules="passwordRules"
      >
        <FormItem prop="password" label="输入登录密码：">
          <Input type="password" placeholder="请添加新登录密码" v-model="passwordForm.password"></Input>
        </FormItem>
        <FormItem prop="passwordAgain" label="确认密码：">
          <Input type="password" placeholder="再次输入登录密码" v-model="passwordForm.passwordAgain"></Input>
        </FormItem>
        <FormItem>
          <Checkbox v-model="requireResetPassword">用户重新登录时重设密码</Checkbox>
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
      <Button type="default" @click="onCancel">取消</Button>
      <Button type="primary" @click="onOk">确定</Button>
    </div>
  </Modal>
  `,
})

export default class ResetPassWord extends Vue {
  $refs!: {
    passwordForm: Form,
  }

  @Prop({type: String}) username!: string
  @Prop({type: Boolean}) isNew!: boolean

  passwordForm = {
    password: '',
    passwordAgain: '',
  }

  showModal = false
  requireResetPassword = false

  get passwordRules() {
    const passwordDiffCheck = {
      trigger: 'blur',
      validator: (rule: string, value: string, cb: Function) => {
        if (this.passwordForm.password !== this.passwordForm.passwordAgain) {
          cb(new Error('两次输入的密码不一致, 请重新输入'))
        } else {
          cb()
        }
      },
    }
    return {
      password: [FORM_RULES.required, FORM_RULES.password],
      passwordAgain: [FORM_RULES.required, passwordDiffCheck],
    }
  }

  doResetPassWord() {
    this.$refs.passwordForm.validate( async (valid) => {
      if (valid) {
        this.$emit('confirm', {
          password: this.passwordForm.password,
          requireResetPassword: this.requireResetPassword,
        })

        if (this.isNew) {
          this.showModal = false
          return
        }
        try {
          await api.User.resetPassword(this.username, {
            password: this.passwordForm.password,
            require_reset_password: this.requireResetPassword,
          })
          this.$Message.success('密码设置成功')
          this.showModal = false
        }catch (e) {
          this.$Message.error('密码设置失败')
        }
      }
    })
  }

  show() {
    this.passwordForm = {
      password: '',
      passwordAgain: '',
    }
    this.showModal = true
  }

  onOk() {
    this.doResetPassWord()
  }

  onCancel() {
    this.showModal = false
  }
}