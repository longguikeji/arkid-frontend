import {User} from '@/models/oneid'
import * as api from '@/services/oneid'
import {FORM_RULES} from '@/utils'
import {Form} from 'iview/types/index'
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import './UserCommon.less'

@Component({
  template: html`
    <SimpleFrame>
      <div class="ui-bind-page">
        <div class="flex-row">
          <div class="ui-bind-page--form-wrapper flex-col">
            <div>
              <div class="top-area">{{isNewUser ? '请输入您的注册信息：' : '请绑定您的手机号：'}}</div>
              <Form
                v-if="!isNewUser"
                :model="mobileForm"
                :label-width="120"
                :rules="mobileFormRules"
                ref="mobileForm"
              >
                <FormItem prop="mobile" label="手机号">
                  <Input type="text" v-model="mobileForm.mobile" placeholder="请输入 手机号码..."></Input>
                </FormItem>
                <FormItem prop="smsCode" label="验证码">
                  <Input type="text" v-model="mobileForm.smsCode" placeholder="请输入 短信验证码..."></Input>
                </FormItem>
                <FormItem prop="submitSmsCode">
                  <Button
                    type="primary"
                    style="width: 100%;"
                    class="simpleframe-btn register-button"
                    @click="submitSmsCode"
                  >
                    提交
                  </Button>
                </FormItem>
              </Form>
            </div>
            <div>
              <Form
                :label-width="120"
                :model="registerForm"
                :rules="registerFormRules"
                v-if="isNewUser"
                ref="registerForm"
              >
                <FormItem prop="username" label="设置用户名">
                  <Input type="text" v-model="registerForm.username" placeholder="设置用户名"></Input>
                </FormItem>
                <FormItem prop="password" label="设置密码">
                  <Input type="password" v-model="registerForm.password" placeholder="设置登录密码..."></Input>
                </FormItem>
                <FormItem prop="passwordAgain" label="确认密码">
                  <Input type="password" v-model="registerForm.passwordAgain" placeholder="确认登录密码..."></Input>
                </FormItem>
                <FormItem prop="submit">
                  <Button
                    type="primary"
                    style="width: 100%;"
                    class="simpleframe-btn register-button"
                    @click="submitRegisterForm"
                  >
                    提交
                  </Button>
                </FormItem>
              </Form>
            </div>
          </div>
          <div class="form-right-area flex-col" v-show="!isNewUser">
            <a class="simpleframe-route" @click="sendSms">获取验证码</a>
            <Icon class="mobile-check"
              v-if="isValidMobile === true"
              type="ios-checkmark-circle"
              color="#52C41A"
              size="18"
            />
            <Icon class="mobile-check"
              v-if="isValidMobile === false"
              type="ios-close-circle"
              color="#F5222D"
              size="18"
            />
          </div>
        </div>
      </div>
    </SimpleFrame>
  `,
})

export default class UserBindThirdParty extends Vue {
  $refs!: {
    mobileForm: Form,
    registerForm: Form,
  }

  isNewUser: boolean = false
  isValidMobile: boolean|null = null
  user: User|null = null

  thirdParty: string = ''

  mobileForm = {
    mobile: '',
    smsCode: '',
    smsToken: '',
    thirdPartyUserId: '',
  }

  registerForm = {
    username: '',
    password: '',
    passwordAgain: '',
    registerToken: '',
  }

  get mobileFormRules() {
    return {
      mobile: [FORM_RULES.required, FORM_RULES.mobile],
    }
  }

  get registerFormRules() {
    const {password, passwordAgain} = this.registerForm
    const passwordDiffCheck = {
      trigger: 'blur',
      validator: (cb: Function) => {
        if (password !== passwordAgain) {
          cb(new Error('两次输入的密码不一致, 请重新输入'))
        } else {
          cb()
        }
      },
    }

    return {
      password: [FORM_RULES.required],
      passwordAgain: [FORM_RULES.required, passwordDiffCheck],
      username: [FORM_RULES.required, FORM_RULES.username],
    }
  }

  mounted() {
    this.varifyState()
  }

  varifyState() {
    const state = sessionStorage.getItem('state')

    if (state === this.$route.query.state) {
      this.thirdParty = this.$route.params.type
      this.getThirdPartyId()
    } else {
      this.$router.push({name: 'oneid.login'})
    }
  }

  async getThirdPartyId() {
    const params = this.thirdParty === 'alipay' ? {
      auth_code: this.$route.query.auth_code,
    } : {
      code: this.$route.query.code,
    }

    const data = await api.UCenter.getThirdPartyUserId(params, this.thirdParty)
    const {third_party_id} = data

    if (third_party_id) {
      this.mobileForm.thirdPartyUserId = third_party_id
    } else {
      this.user = data
      this.doLogin()
    }
  }

  async sendSms() {
    this.$refs.mobileForm.validate((isValid: boolean|void) => {
      if (!isValid) {
        return
      }
    })

    const {mobile} = this.mobileForm
    try {
      await api.ApiService.sendBindSms(mobile)
      this.$Message.success('成功发送短信')
    } catch(err) {
      this.$Message.error('发送短信失败')
    }
  }

  submitSmsCode() {
    const {smsCode} = this.mobileForm
    if (/^\d{6}$/.test(smsCode)) {
      this.verifyMobile()
    } else {
      this.isValidMobile = false
    }
  }

  async verifyMobile() {
    const {mobile,smsCode} = this.mobileForm
    this.$Loading.start()
    try {
      const {sms_token} = await api.ApiService.verifySmsWithBind(mobile, smsCode)
      this.mobileForm.smsToken = sms_token
      this.$Loading.finish()
      this.isValidMobile = true
      this.checkUserExist()
    } catch (e) {
      this.isValidMobile = false
      this.$Loading.error()
    }
  }

  async checkUserExist() {
    const {mobile, smsToken} = this.mobileForm

    const {exist} = await api.UCenter.checkExistWithMobile({
      mobile,
      sms_token: smsToken,
    })
    if (exist) {
      this.bindMobileWithThirdParty()
    } else {
      this.isNewUser = true
    }
  }

  async bindMobileWithThirdParty() {
    const {thirdPartyUserId, smsToken} = this.mobileForm

    try {
      const user = await api.UCenter.bindMobileWithThirdParty({
        user_id: thirdPartyUserId,
        sms_token: smsToken,
      }, this.thirdParty)
      this.user = user
      this.$Message.success('成功绑定手机号')
      this.doLogin()
    } catch (e) {
      this.$Message.error('绑定手机号失败')
    }
  }

  async submitRegisterForm() {
    this.$refs.registerForm.validate((isValid: boolean|void) => {
      if (!isValid) {
        return
      }
    })
    const {username, password} = this.registerForm
    const {smsToken, thirdPartyUserId} = this.mobileForm
    try {
      const user = await api.UCenter.registerWithThirdParty({
        username,
        password,
        user_id: thirdPartyUserId,
        sms_token: smsToken,
      }, this.thirdParty)
      this.user = user
      this.$Message.success('注册成功')
      this.doLogin()
    } catch (e) {
      this.$Message.error('注册失败')
    }
  }

  async doLogin() {

    const user = {
      isLogin: true,
      ...this.user,
    }

    this.$app.onLogin(user)

    this.$router.push({name:'workspace.apps'})

  }
}