import {Vue, Component, Prop} from 'vue-property-decorator';
import {User} from '@/models/oneid';
import * as api from '@/services/oneid';
import {Form} from 'iview/types/index';
import {FORM_RULES} from '@/utils';
import './dingQrLogin.js';
import './UserCommon.less';


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
          <RouterLink v-if="isRegisterEnabled" :to="registerRouterLink" class="simpleframe-route go-to">没有账号？去注册</RouterLink>
        </FormItem>
      </Form>
      <div class="ui-other-login-boundline" v-if="dingQrAccount || false">
        <p>其他登录方式</p>
      </div>
      <div class="ui-login-third-party" @click="e => e.stopPropagation()">
        <div
          class="ui-qr-poptip"
          v-show="thirdPartyType !== ''"
        >
          <div id="login_container" v-show="thirdPartyType === 'ding'"></div>
          <Button class="cancle-btn" @click="thirdPartyType = ''">取消</Button>
        </div>
        <div class="ui-qr-diff-btn">
          <div
            :class="thirdPartyType === 'ding' ? 'ui-qr-btn-chosen' : 'ui-qr-btn-unchose'"
            @click="toggleDingPoptip"
            v-show="dingQrAccount"
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
            v-show=""
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
            :class="thirdPartyType === 'wechatwork' ? 'ui-qr-btn-chosen' : 'ui-qr-btn-unchose'"
            @click="toggleWechatWorkPoptip"
            v-show=""
          >
            <img :src="wechatworkImgPath"/>
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
  };
  form = {
    selectedLoginType: '用户名',
    accountname: '',
    password: '',
  };
  formRules = {
    accountname: [FORM_RULES.required],
    password: [FORM_RULES.required],
  };

  user: User|null = null;

  thirdPartyType: string = '';
  dingQrAccount: boolean = false;
  redirectUri: string|null = null;

  dingImgPath: string = require('../../assets/icons/icon-login-dingding.png');
  wechatImgPath: string = require('../../assets/icons/icon-login-wechat.png');
  alipayImgPath: string = require('../../assets/icons/icon-login-alipay.png');
  qqImgPath: string = require('../../assets/icons/icon-login-qq.png');
  wechatworkImgPath: string = require('../../assets/icons/icon-login-wechatwork.png');

  get isRegisterEnabled() {
    return this.$app.metaInfo!.account.isRegisterEnabled;
  }

  get isResetPasswordEnable() {
    return this.$app.metaInfo!.account.isResetPasswordEnabled;
  }

  get registerRouterLink() {
    return {
      name: 'oneid.signup',
      query: {
        next: this.nextURL,
      },
    };
  }

  mounted() {
    this.loginStateCheck();
    this.dingQrAccount = this.$app.metaInfo!.account.support_ding_qr;
  }

  get loginType() {
    let loginTypes = ['用户名'];
    if (this.$app.metaInfo!.account.support_email) {
      loginTypes.push('邮箱');
    }

    if (this.$app.metaInfo!.account.support_mobile) {
      loginTypes.push('手机号');
    }
    return loginTypes;
  }

  loginStateCheck() {
    if (this.$app.isLogin) {
      this.$app.goHome();
    }
  }

  onLoginTypeChange() {
    this.$refs.form.resetFields();
  }

  async login() {
    const {form} = this;
    try {
      let params = {password: form.password};
      if (form.selectedLoginType === this.loginType[0]) {
        params['username'] = form.accountname;
      }
      else if(form.selectedLoginType.includes('邮箱')) {
        params['private_email'] = form.accountname;
      }
      else {
        params['mobile'] = form.accountname;
      }

      const user = await api.login(params);
      this.user = user;
      this.$Message.success('登录成功');
    } catch(err) {
      console.log(err);
      this.$Message.error('登录失败');
      return;
    }
    this.doLogin();
  }

  get nextURL(): string {
    let {next} = this.$route.query;
    if (next && typeof next === 'string') {
      next = next.replace('_authorize', 'authorize');
      const urlParams = new URLSearchParams(next);
      if (urlParams.get('oneid_token')) {
        next = next.replace('oneid_token', '_oneid_token');
      }
      return next;
    }
    return '';
  }

  doLogin() {
    if (this.nextURL) {
      window.location.href = this.nextURL;
      return;
    }

    this.$app.onLogin({
      isLogin: true,
      ...this.user,
    });

    const {backPath} = this.$route.query;
    if (backPath && typeof backPath === 'string') {
      this.$router.push(backPath);
    } else {
      this.$app.goHome();
    }
  }

  handleSubmit() {
    this.$refs.form.validate((valid: boolean) => {
      if (valid) {
        this.login();
      }
    });
  }

  toggleDingPoptip() {
    this.thirdPartyType = this.thirdPartyType === 'ding' ? '' : 'ding';
    if(this.thirdPartyType === 'ding') {
      this.showDingQrCode();
    }
  }

  showDingQrCode() {
    this.redirectUri = window.location.origin + '/%23/oneid/bindthirdparty';

    const url = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?`
      + `appid=${this.$app.metaInfo!.ding.qrAppId}`
      + `&response_type=code&scope=snsapi_login&state=STATE`
      + `&redirect_uri=${this.redirectUri}`;

    window.dingQrCode({
      id:'login_container',
      style: 'border:none;background-color:#FFFFFF;',
      goto: encodeURIComponent(url),
      width : '600px',
      height: '330px',
    });

    this.addDingEvent();
  }

  addDingEvent() {
    if (typeof window.addEventListener !== 'undefined') {
        window.addEventListener('message', this.handleDingMessage, false);
    } else if (typeof window.attachEvent !== 'undefined') {
        window.attachEvent('onmessage', this.handleDingMessage);
    }
  }

  handleDingMessage(event: any) {
    const loginTmpCode = event.data;
    const origin = event.origin;

    const url = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?`
      + `appid=${this.$app.metaInfo!.ding.qrAppId}`
      + `&response_type=code&scope=snsapi_login&state=STATE`
      + `&redirect_uri=${this.redirectUri}`
      + `&loginTmpCode=${loginTmpCode}`;

    if (origin === 'https://login.dingtalk.com') {
      window.location.href = url;
    }
  }

  toggleWechatPoptip() {
    this.thirdPartyType = this.thirdPartyType === 'wechat' ? '' : 'wechat';
  }

  toggleAlipayPoptip() {
    this.thirdPartyType = this.thirdPartyType === 'alipay' ? '' : 'alipay';
  }

  toggleQqPoptip() {
    this.thirdPartyType = this.thirdPartyType === 'qq' ? '' : 'qq';
  }

  toggleWechatWorkPoptip() {
    this.thirdPartyType = this.thirdPartyType === 'wechatwork' ? '' : 'wechatwork';
  }
}
