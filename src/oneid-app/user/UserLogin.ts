import {Vue, Component, Prop} from 'vue-property-decorator';
import {User} from '@/models/oneid';
import * as api from '@/services/oneid';
import {Form} from 'iview/types/index';
import {FORM_RULES} from '@/utils';
import './DingQrLogin.js';
import './UserCommon.less';


@Component({
  template: html`
<div @click="poptipVisible = ''">
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
      <div class="ui-other-login-boundline">
        <p>其他登录方式</p>
      </div>
      <div class="ui-login-third-party" @click="e => e.stopPropagation()">
        <div
          class="ui-qr-poptip"
          v-show="poptipVisible !== ''"
        >
          <div id="login_container" v-show="poptipVisible === 'ding'"></div>
          <Button class="cancle-btn" @click="poptipVisible = ''">取消</Button>
        </div>
        <div class="ui-qr-diff-btn">
          <div
            :class="poptipVisible === 'ding' ? 'ui-qr-btn-chosen' : 'ui-qr-btn-unchose'"
            @click="dingLogin"
            v-show="dingQrAccount"
          >
            <img :src="dingImgPath"/>
            <p>钉钉</p>
          </div>
          <div
            :class="poptipVisible === 'wechat' ? 'ui-qr-btn-chosen' : 'ui-qr-btn-unchose'"
            @click="wechatLogin"
          >
            <img :src="wechatImgPath"/>
            <p>微信</p>
          </div>
          <div
            :class="poptipVisible === 'alipay' ? 'ui-qr-btn-chosen' : 'ui-qr-btn-unchose'"
            @click="alipayLogin"
          >
            <img :src="alipayImgPath"/>
            <p>支付宝</p>
          </div>
          <div
            :class="poptipVisible === 'qq' ? 'ui-qr-btn-chosen' : 'ui-qr-btn-unchose'"
            @click="qqLogin"
          >
            <img :src="qqImgPath"/>
            <p>qq</p>
          </div>
          <div
            :class="poptipVisible === 'wechatwork' ? 'ui-qr-btn-chosen' : 'ui-qr-btn-unchose'"
            @click="wechatworkLogin"
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

  poptipVisible: string = '';
  dingQrAccount: boolean = true;

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
      if (form.selectedLoginType == this.loginType[0]) {
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

  dingLogin() {
    this.poptipVisible = this.poptipVisible === 'ding' ? '' : 'ding';

    dingQrCode({
      id:'login_container',
      style: 'border:none;background-color:#FFFFFF;',
      goto: encodeURI('https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=dingoawoeovveele6cbbt2&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=https://oneid.intra.longguikeji.com/dingding/qr/callback/'),
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

    if (origin === 'https://login.dingtalk.com') {
      window.location.href='https://oapi.dingtalk.com/connect/oauth2/sns_authorize?'
                            + 'appid=dingoawoeovveele6cbbt2'
                            + '&response_type=code'
                            + '&scope=snsapi_login&state=STATE'
                            + '&redirect_uri=https://oneid.intra.longguikeji.com/dingding/qr/callback/'
                            + '&loginTmpCode=' + loginTmpCode;
    }
  }

  wechatLogin() {
    this.poptipVisible = this.poptipVisible === 'wechat' ? '' : 'wechat';
  }

  alipayLogin() {
    this.poptipVisible = this.poptipVisible === 'alipay' ? '' : 'alipay';
  }

  qqLogin() {
    this.poptipVisible = this.poptipVisible === 'qq' ? '' : 'qq';
  }

  wechatworkLogin() {
    this.poptipVisible = this.poptipVisible === 'wechatwork' ? '' : 'wechatwork';
  }
}
