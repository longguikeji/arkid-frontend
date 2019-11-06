import {User} from '@/models/oneid'
import * as api from '@/services/oneid'
import {FORM_RULES, uuidHex} from '@/utils'
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
        v-if="isThirdPartyExist"
      >
        <p>其他登录方式</p>
      </div>
      <div class="ui-login-third-party" @click="e => e.stopPropagation()">
        <div
          class="ui-qr-poptip"
          v-show="thirdPartyType !== ''"
        >
          <div id="qrContainer" v-show="thirdPartyType !== ''"></div>
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
            v-show="qrAccount.support_wechat_qr"
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
            v-show="qrAccount.support_qq_qr"
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
  uuid: string = ''

  dingImgPath: string = require('@/assets/icons/icon-login-dingding.png')
  wechatImgPath: string = require('@/assets/icons/icon-login-wechat.png')
  alipayImgPath: string = require('@/assets/icons/icon-login-alipay.png')
  qqImgPath: string = require('@/assets/icons/icon-login-qq.png')
  wechatWorkImgPath: string = require('@/assets/icons/icon-login-wechatwork.png')

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

  get isThirdPartyExist() {
    const account = this.qrAccount
    return account.support_ding_qr
      || account.support_alipay_qr
      || account.support_work_wechat_qr
      || account.support_wechat_qr
      || account.support_qq_qr
  }
  get redirectUri() {
    return window.location.origin + `/#/oneid/bindthirdparty/${this.thirdPartyType}`
  }

  get dingAuthUrl() {
    let url = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?`
    const urlParams = new URLSearchParams({
      appid: this.$app.metaInfo!.ding.qrAppId,
      response_type: 'code',
      scope: 'snsapi_login',
      redirect_uri: this.redirectUri,
    })
    url += urlParams.toString()

    return url
  }

  get dingQrSrc() {
    let src = `https://login.dingtalk.com/login/qrcode.htm?`
    const srcParams = new URLSearchParams({
      goto: this.dingAuthUrl,
      style: 'border:none;background-color:#FFF;',
    })
    src += srcParams.toString()

    return src
  }

  get wechatQrSrc() {
    let src = `https://open.weixin.qq.com/connect/qrconnect?`
    const srcParams = new URLSearchParams({
      appid: this.$app.metaInfo!.wechat.appId,
      state: this.uuid,
      redirect_uri: this.redirectUri,
      scope: 'snsapi_login',
      href: 'data:text/css;base64,QGNoYXJzZXQgIlVURi04IjsKLmltcG93ZXJCb3ggLnFyY29kZSB7d2lkdGg6IDIzMHB4O2JvcmRlcjowO30KLmltcG93ZXJCb3ggLnRpdGxlIHtkaXNwbGF5OiBub25lO30KLmltcG93ZXJCb3ggLmluZm8ge3dpZHRoOiAyMzBweDt9Ci5zdGF0dXNfaWNvbiB7ZGlzcGxheTogbm9uZX0KLmltcG93ZXJCb3ggLnN0YXR1cyB7dGV4dC1hbGlnbjogY2VudGVyO30=',
    })
    src += srcParams.toString()
    return src
  }

  get alipayAuthUrl() {
    let url = `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?`
    const urlParams = new URLSearchParams({
      app_id: this.$app.metaInfo!.alipay.appId,
      scope: 'auth_base',
      state: this.uuid,
      redirect_uri: this.redirectUri,
    })
    url += urlParams.toString()

    return url
  }

  get qqAuthUrl() {
    let src = `https://graph.qq.com/oauth2.0/authorize?`
    const srcParams = new URLSearchParams({
      client_id: this.$app.metaInfo!.qq.appId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      state: this.uuid,
    })
    src += srcParams.toString()
    return src
  }

  get wechatWorkQrSrc() {
    let src = `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?`
    const srcParams = new URLSearchParams({
      appid: this.$app.metaInfo!.wechatWork.corpId,
      agentid: this.$app.metaInfo!.wechatWork.agentId,
      state: this.uuid,
      redirect_uri: this.redirectUri,
      logintype: 'jssdk',
      href: 'data:text/css;base64,QGNoYXJzZXQgIlVURi04IjsKLmltcG93ZXJCb3ggLnFyY29kZSB7d2lkdGg6IDIzMHB4O30KLmltcG93ZXJCb3ggLnRpdGxlIHtkaXNwbGF5OiBub25lO30KLmltcG93ZXJCb3ggLmluZm8ge3dpZHRoOiAyMzBweDt9Ci5zdGF0dXNfaWNvbiB7ZGlzcGxheTogbm9uZX0KLmltcG93ZXJCb3ggLnN0YXR1cyB7dGV4dC1hbGlnbjogY2VudGVyO30=',
    })
    src += srcParams.toString()

    return src
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

  mounted() {
    this.loginStateCheck()
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
    this.createQr({
      id:'qrContainer',
      src: this.dingQrSrc,
    })

    this.addDingEvent()
  }

  addDingEvent() {
    window.addEventListener('message', this.handleDingMessage, false)
  }

  handleDingMessage(event: MessageEvent) {
    const loginTmpCode = event.data
    const origin = event.origin

    this.uuid = uuidHex()
    sessionStorage.setItem('state', this.uuid)
    const url = this.dingAuthUrl + `&state=${this.uuid}&loginTmpCode=${loginTmpCode}`

    if (origin === 'https://login.dingtalk.com') {
      window.location.href = url
    }
  }

  toggleWechatPoptip() {
    this.thirdPartyType = this.thirdPartyType === 'wechat' ? '' : 'wechat'

    this.uuid = uuidHex()
    sessionStorage.setItem('state', this.uuid)

    this.createQr({
      id: 'qrContainer',
      src: this.wechatQrSrc,
    })
  }

  toggleAlipayPoptip() {
    this.thirdPartyType = 'alipay'

    this.uuid = uuidHex()
    sessionStorage.setItem('state', this.uuid)

    window.location.href = this.alipayAuthUrl
    this.thirdPartyType = ''
  }

  toggleQqPoptip() {
    this.thirdPartyType = 'qq'

    this.uuid = uuidHex()
    sessionStorage.setItem('state', this.uuid)

    window.location.href = this.qqAuthUrl
    this.thirdPartyType = ''
  }

  toggleWechatWorkPoptip() {
    this.thirdPartyType = this.thirdPartyType === 'wechatWork' ? '' : 'wechatWork'

    this.uuid = uuidHex()
    sessionStorage.setItem('state', this.uuid)

    this.createQr({
      id: 'qrContainer',
      src: this.wechatWorkQrSrc,
    })
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
