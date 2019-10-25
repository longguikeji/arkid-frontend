import {User} from '@/models/oneid'
import * as api from '@/services/oneid'
import {FORM_RULES} from '@/utils'
import {Form} from 'iview/types/index'
import {Component, Prop, Vue} from 'vue-property-decorator'
import './UserCommon.less'

@Component({
  template: html`
<div @click="thirdPartyType = ''">
<SimpleFrame>
  <SiteLogo
    slot="logo"
    v-if="siteLogo"
    v-bind="siteLogo"
  />
  <div class="ui-login-page">
    <div class="ui-login-page--form-wrapper">
      <Form ref="form" :model="form" :label-width="120" :rules="formRules" class="form"
        autocomplete="off"
      >
        <FormItem label="选择登陆方式:">
          <RadioGroup class="login-type flex-row" v-model="form.selectedLoginType" @on-change="onLoginTypeChange">
            <Radio v-for="item in loginType" :label="item">
                <span>{{ item }}</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem prop="accountname" :label="form.selectedLoginType + ':'">
          <Input type="text" v-model="form.accountname"></Input>
        </FormItem>
        <FormItem prop="password" label="密码:">
          <Input type="password" v-model="form.password"></Input>
          <RouterLink v-if="isResetPasswordEnable" :to="{name: 'oneid.password'}" class="forget">忘记密码</RouterLink>
        </FormItem>
        <FormItem>
          <Button class="simpleframe-btn" type="primary" @click="handleSubmit" style="width: 100%;">登录</Button>
          <RouterLink v-if="isRegisterEnabled" :to="registerRouterLink" class="simpleframe-route go-to">
            没有账号？去注册
          </RouterLink>
        </FormItem>
      </Form>
      <div
        class="ui-other-login-boundline"
        v-if="qrAccount.support_ding_qr || qrAccount.support_alipay_qr"
      >
        <p>其他登录方式</p>
      </div>
      <div class="ui-login-third-party" @click="e => e.stopPropagation()">
        <div
          class="ui-qr-poptip"
          v-show="thirdPartyType !== ''"
        >
          <div id="qr_container" v-show="thirdPartyType !== ''"></div>
          <Button class="cancle-btn" @click="thirdPartyType = ''">取消</Button>
        </div>
        <div class="ui-qr-diff-btn">
          <div
            :class="thirdPartyType === 'ding' ? 'ui-qr-btn-chosen' : 'ui-qr-btn-unchose'"
            @click="toggleDingPoptip"
            v-show="qrAccount.support_ding_qr"
          >
            <img :src="dingImgPath"/>
            <p>钉钉</p>
          </div>
          <div
            :class="thirdPartyType === 'wechat' ? 'ui-qr-btn-chosen' : 'ui-qr-btn-unchose'"
            @click="toggleWechatPoptip"
            v-show=""
          >
            <img :src="wechatImgPath"/>
            <p>微信</p>
          </div>
          <div
            :class="thirdPartyType === 'alipay' ? 'ui-qr-btn-chosen' : 'ui-qr-btn-unchose'"
            @click="toggleAlipayPoptip"
            v-show="qrAccount.support_alipay_qr"
          >
            <img :src="alipayImgPath"/>
            <p>支付宝</p>
          </div>
          <div
            :class="thirdPartyType === 'qq' ? 'ui-qr-btn-chosen' : 'ui-qr-btn-unchose'"
            @click="toggleQqPoptip"
            v-show=""
          >
            <img :src="qqImgPath"/>
            <p>qq</p>
          </div>
          <div
            :class="thirdPartyType === 'wechatWork' ? 'ui-qr-btn-chosen' : 'ui-qr-btn-unchose'"
            @click="toggleWechatWorkPoptip"
            v-show="qrAccount.support_work_wechat_qr"
          >
            <img :src="wechatWorkImgPath"/>
            <p>企业微信</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</SimpleFrame>
</div>
  `,
})
export default class UserLogin extends Vue {

  $refs!: {
    form: Form,
  }
  form = {
    selectedLoginType: '用户名',
    accountname: '',
    password: '',
  }
  formRules = {
    accountname: [FORM_RULES.required],
    password: [FORM_RULES.required],
  }

  user: User|null = null

  thirdPartyType: string = ''

  dingImgPath: string = require('../../assets/icons/icon-login-dingding.png')
  wechatImgPath: string = require('../../assets/icons/icon-login-wechat.png')
  alipayImgPath: string = require('../../assets/icons/icon-login-alipay.png')
  qqImgPath: string = require('../../assets/icons/icon-login-qq.png')
  wechatWorkImgPath: string = require('../../assets/icons/icon-login-wechatwork.png')

  get isRegisterEnabled() {
    return this.$app.metaInfo!.account.isRegisterEnabled
  }

  get isResetPasswordEnable() {
    return this.$app.metaInfo!.account.isResetPasswordEnabled
  }

  get registerRouterLink() {
    return {
      name: 'oneid.signup',
      query: {
        next: this.nextURL,
      },
    }
  }

  get qrAccount() {
    return this.$app.metaInfo!.account
  }

  get redirectUri() {
    let redirectUri = window.location.origin
    redirectUri += this.thirdPartyType === 'ding' ? '/%23/' : '/#/'
    redirectUri += 'oneid/bindthirdparty'
    return redirectUri
  }

  mounted() {
    this.loginStateCheck()
  }

  get loginType() {
    const loginTypes = ['用户名']
    if (this.$app.metaInfo!.account.support_email) {
      loginTypes.push('邮箱')
    }

    if (this.$app.metaInfo!.account.support_mobile) {
      loginTypes.push('手机号')
    }
    return loginTypes
  }

  loginStateCheck() {
    if (this.$app.isLogin) {
      this.$app.goHome()
    }
  }

  onLoginTypeChange() {
    this.$refs.form.resetFields()
  }

  async login() {
    const {form} = this
    try {
      const params: {
        password?: string,
        username?: string,
        private_email?: string,
        mobile?: string,
      } = {password: form.password}

      if (form.selectedLoginType === this.loginType[0]) {
        params.username = form.accountname
      }
      else if(form.selectedLoginType.includes('邮箱')) {
        params.private_email = form.accountname
      }
      else {
        params.mobile = form.accountname
      }

      const user = await api.login(params)
      this.user = user
      this.$Message.success('登录成功')
    } catch(err) {
      this.$Message.error('登录失败')
      return
    }
    this.doLogin()
  }

  get nextURL(): string {
    let {next} = this.$route.query
    if (next && typeof next === 'string') {
      next = next.replace('_authorize', 'authorize')
      const urlParams = new URLSearchParams(next)
      if (urlParams.get('oneid_token')) {
        next = next.replace('oneid_token', '_oneid_token')
      }
      return next
    }
    return ''
  }

  doLogin() {
    if (this.nextURL) {
      window.location.href = this.nextURL
      return
    }

    this.$app.onLogin({
      isLogin: true,
      ...this.user,
    })

    const {backPath} = this.$route.query
    if (backPath && typeof backPath === 'string') {
      this.$router.push(backPath)
    } else {
      this.$app.goHome()
    }
  }

  handleSubmit() {
    this.$refs.form.validate((valid: boolean|void) => {
      if (valid) {
        this.login()
      }
    })
  }

  toggleDingPoptip() {
    this.thirdPartyType = this.thirdPartyType === 'ding' ? '' : 'ding'
    if(this.thirdPartyType === 'ding') {
      this.showDingQrCode()
    }
  }

  showDingQrCode() {
    const url = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?`
      + `appid=${this.$app.metaInfo!.ding.qrAppId}`
      + `&response_type=code&scope=snsapi_login&state=`
      + `&redirect_uri=${this.redirectUri}`

    const src = `https://login.dingtalk.com/login/qrcode.htm?goto=${encodeURIComponent(url)}`
      + `&style=${encodeURIComponent('border:none;background-color:#FFF;')}`

    this.createQr({
      id:'qr_container',
      src,
    })

    this.addDingEvent()
  }

  addDingEvent() {
    window.addEventListener('message', this.handleDingMessage, false)
  }

  handleDingMessage(event: MessageEvent) {
    const loginTmpCode = event.data
    const origin = event.origin

    const state = 'ding_' + this.proRandomNum()
    sessionStorage.setItem('state', state)

    const url = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?`
      + `appid=${this.$app.metaInfo!.ding.qrAppId}`
      + `&response_type=code&scope=snsapi_login`
      + `&state=${state}`
      + `&redirect_uri=${this.redirectUri}`
      + `&loginTmpCode=${loginTmpCode}`

    if (origin === 'https://login.dingtalk.com') {
      window.location.href = url
    }
  }

  toggleWechatPoptip() {
    this.thirdPartyType = this.thirdPartyType === 'wechat' ? '' : 'wechat'
  }

  toggleAlipayPoptip() {
    const appId = this.$app.metaInfo!.alipay.appId

    const state = 'alipay_' + this.proRandomNum()
    sessionStorage.setItem('state', state)

    const href = `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?`
      + `app_id=${appId}`
      + `&scope=auth_base`
      + `&state=${state}`
      + `&redirect_uri=${encodeURIComponent(this.redirectUri)}`

    window.location.href = href
  }

  toggleQqPoptip() {
    this.thirdPartyType = this.thirdPartyType === 'qq' ? '' : 'qq'
  }

  toggleWechatWorkPoptip() {
    this.thirdPartyType = this.thirdPartyType === 'wechatWork' ? '' : 'wechatWork'

    const state = 'wechatWork_' + this.proRandomNum()
    sessionStorage.setItem('state', state)

    const src = `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?`
     + `appid=${this.$app.metaInfo!.wechatWork.corpId}`
     + `&agentid=${this.$app.metaInfo!.wechatWork.agentId}`
     + `&redirect_uri=${encodeURIComponent(this.redirectUri)}`
     + `&state=${state}`
     + `&logintype=jssdk`
     + `&href=data:text/css;base64,QGNoYXJzZXQgIlVURi04IjsKLmltcG93ZXJCb3ggLnFyY29kZSB7d2lkdGg6IDIzMHB4O30KLmltcG93ZXJCb3ggLnRpdGxlIHtkaXNwbGF5OiBub25lO30KLmltcG93ZXJCb3ggLmluZm8ge3dpZHRoOiAyMzBweDt9Ci5zdGF0dXNfaWNvbiB7ZGlzcGxheTogbm9uZX0KLmltcG93ZXJCb3ggLnN0YXR1cyB7dGV4dC1hbGlnbjogY2VudGVyO30=`

    this.createQr({
      id: 'qr_container',
      src,
    })
  }

  proRandomNum() {
    return Math.round(Math.random()*100000).toString()
  }

  createQr(params: {id: string, src: string}) {
    const iframe = document.createElement('iframe')
    iframe.src = params.src

    // tslint:disable-next-line: deprecation
    iframe.frameBorder = '0'
    iframe.width = '600px'
    iframe.height = '330px'

    const element = document.getElementById(params.id)
    element!.innerHTML = ''
    element!.appendChild(iframe)
  }
}
