import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import * as api from '@/services/oneid';
import {User} from '@/models/oneid';
import {Form} from 'iview/types/index';
import {FORM_RULES} from '@/utils';
import './UserCommon.less';

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

export default class UserBind extends Vue {
  $refs!: {
    mobileForm: Form,
    registerForm: Form,
  };

  isNewUser: boolean = false;
  isValidMobile: boolean|null = null;
  user: User|null = null;

  mobileForm = {
    mobile: '',
    smsCode: '',
    smsToken: '',
    dingId: '',
  };

  registerForm = {
    username: '',
    password: '',
    passwordAgain: '',
    registerToken: '',
  };

  get mobileFormRules() {
    return {
      mobile: [FORM_RULES.required, FORM_RULES.mobile],
    };
  }

  get registerFormRules() {
    const {password, passwordAgain} = this.registerForm;
    const passwordDiffCheck = {
      trigger: 'blur',
      validator: (rule: any, value: string, cb: any) => {
        if (password !== passwordAgain) {
          cb(new Error('两次输入的密码不一致, 请重新输入'));
        } else {
          cb();
        }
      },
    };

    return {
      password: [FORM_RULES.required],
      passwordAgain: [FORM_RULES.required, passwordDiffCheck],
      username: [FORM_RULES.required, FORM_RULES.username],
    };
  }

  async created() {
    const {code, state} = this.$route.query;

    try {
      const data = await api.UCenter.getDingIdWithCode({
        code,
        state,
      });
      const {dingId} = data;

      if (dingId !== undefined) {
        this.mobileForm.dingId = dingId;
      } else {
        this.user = data;
        this.doLogin();
      }
    } catch (e) {
      console.log(e);
    }
  }

  async sendSms() {
    const isValid: any = await this.$refs.mobileForm.validate();
    if (!isValid) {
      return;
    }
    const {mobile} = this.mobileForm;
    try {
      await api.ApiService.sendBindSms(mobile);
      this.$Message.success('成功发送短信');
    } catch(err) {
      console.log(err);
      this.$Message.error('发送短信失败');
    }
  }

  submitSmsCode() {
    const {smsCode} = this.mobileForm;
    if (/^\d{6}$/.test(smsCode)) {
      this.verifyMobile();
    } else {
      this.isValidMobile = false;
    }
  }

  async verifyMobile() {
    const {mobile,smsCode,dingId} = this.mobileForm;
    this.$Loading.start();
    try {
      const {sms_token} = await api.ApiService.verifySmsWithBind(mobile, smsCode, dingId);
      this.mobileForm.smsToken = sms_token;
      this.$Loading.finish();
      this.isValidMobile = true;
      this.isUserExist();
    } catch (e) {
      this.isValidMobile = false;
      this.$Loading.error();
    }
  }

  async isUserExist() {
    const {mobile, dingId, smsToken} = this.mobileForm;
    try {
      const {exist} = await api.UCenter.checkUserExistWithMobile({
        mobile,
        dingId,
        sms_token: smsToken,
      });
      if(exist) {
        this.bindUserWithType();
      } else {
        this.isNewUser = true;
      }
    } catch (e) {
      console.log(e);
    }
  }

  async bindUserWithType() {
    const {dingId, smsToken} = this.mobileForm;
    const type = 'dingding';
    try {
      const user = await api.UCenter.bindUserWithType({
        dingId,
        sms_token: smsToken,
      });
      this.user = user;
      this.$Message.success('成功绑定手机号');
      this.doLogin();
    } catch (e) {
      console.log(e);
      this.$Message.error('绑定手机号失败');
    }
  }

  async submitRegisterForm() {
    const isValid: any = await this.$refs.registerForm.validate();
    if (!isValid) {
      return;
    }

    const {username, password} = this.registerForm;
    const {smsToken, dingId} = this.mobileForm;

    try {
      const user = await api.UCenter.registerWithBind({
        username,
        password,
        dingId,
        sms_token: smsToken,
      });
      this.user = user;
      this.$Message.success('注册成功');
      this.doLogin();
    } catch (e) {
      this.$Message.error('注册失败');
      console.log(e);
    }
  }

  async doLogin() {

    const user = {
      isLogin: true,
      ...this.user,
    };

    this.$app.onLogin(user);

    this.$router.push({name:'workspace.userinfo'});

  }
}


