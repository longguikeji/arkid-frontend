import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import {Form} from 'iview/types/index';
import * as api from '@/services/oneid';
import './UserCommon.less';
import {FORM_RULES} from '@/utils';


@Component({
  template: html`
<SimpleFrame>
  <div class="ui-password-page">
    <div class="flex-row">
      <div class="ui-password-page--form-wrapper">
        <Form v-if="!isVerified" :label-width="120" :rules="formRules" class="form" autocomplete="off">
          <FormItem  label="选择方式:">
            <RadioGroup class="login-type flex-row" v-model="selectedResetPasswordType" @on-change="onResetTypeChange">
              <Radio v-for="item in resetPasswordType" :label="item">
                  <span>{{ item }}</span>
              </Radio>
            </RadioGroup>
          </FormItem>
        </Form>
        <div>
          <Form 
            v-if="isEmailFormShow"
            ref="emailForm" :model="emailForm" :label-width="120" :rules="emailFormRules">
            <FormItem prop="username" label="用户名">
              <Input type="text" v-model="emailForm.username" placeholder="请输入 用户名称..."></Input>
            </FormItem>
            <FormItem prop="email" label="个人邮箱">
              <Input type="text" v-model="emailForm.email" placeholder="请输入 个人邮箱账号..."></Input>
            </FormItem>
            <div :style="{'visibility': getVisibleState(0)}" class="form-alert-line flex-row">
              <Alert closable class="form-alert" show-icon>邮件已发送，请登录您的个人邮箱，按照邮件内容指引重置密码</Alert>
            </div>
            <FormItem class="operation-button">
              <Button class="simpleframe-btn" :disabled="isEmailSend" type="primary" @click="handleSendEmail" style="width: 100%;">
              {{ isEmailSend ? "邮件已发送" : "发送验证邮件" }}
              </Button>
            </FormItem>
          </Form>
        </div>
        <div>
          <Form  
            v-if="isMobileFormShow"
            ref="mobileForm" :model="mobileForm" :label-width="120" :rules="mobileFormRules">
            <FormItem prop="username" label="用户名">
              <Input type="text" v-model="mobileForm.username" placeholder="请输入 用户名称..."></Input>
            </FormItem>
            <FormItem prop="mobile" label="手机">
              <Input type="text" v-model="mobileForm.mobile" placeholder="请输入 手机号码..."></Input>
            </FormItem>
            <FormItem prop="smsCode" label="验证码">
              <Input type="text" v-model="mobileForm.smsCode" placeholder="请输入 短信验证码..."></Input>
            </FormItem>
            <FormItem class="operation-button">
              <Button class="simpleframe-btn" type="primary" @click="handleVerifySms" style="width: 100%;">下一步</Button>
            </FormItem>
          </Form>
        </div>
        <div>
          <Form v-if="isVerified" ref="resetForm" :model="resetForm" :label-width="120" :rules="resetFormRules">
            <div class="welcome-word flex-row"><span>Hi, {{ emailForm.username || mobileForm.username }}</span></div>
            <FormItem prop="firstPassword" label="设置新密码">
              <Input type="password" v-model="resetForm.firstPassword" placeholder="填写新密码..."></Input>
            </FormItem>
            <FormItem prop="secondPassword" label="确认新密码">
              <Input type="password" v-model="resetForm.secondPassword" placeholder="确认新密码..."></Input>
            </FormItem>
            <FormItem class="reset-button">
              <Button class="simpleframe-btn" type="primary" @click="handleResetPassword" style="width: 100%;">确认重置</Button>
            </FormItem>
          </Form>
        </div>

        <RouterLink :to="{name: 'oneid.login'}" class="simpleframe-route go-to">返回登录页</RouterLink>
      </div>
      <div :style="{'visibility': getVisibleState(1)}" class="form-right-area flex-col">
        <a @click="sendSms" class="simpleframe-route verify-code">获取验证码</a>
      </div>
    </div>
  </div>
</SimpleFrame>
  `,
})
export default class UserPassword extends Vue {
  $refs!: {
    emailForm: Form,
    mobileForm: Form,
    resetForm: Form,
  };
  selectedResetPasswordType = '';
  mobileForm = {username: '', mobile: '', captcha: '', smsCode: '', smsToken: ''};
  emailForm = {username: '', email: '', emailToken: ''};
  resetForm = {firstPassword: '', secondPassword: ''};
  resetPasswordType: string[] = [];
  captchaKey = '';
  captchaImg = '';
  isVerified = '';
  isEmailSend = false;

  get emailFormRules() {
    return {
      email: [FORM_RULES.required, FORM_RULES.email],
      username: [FORM_RULES.required, FORM_RULES.username],
    }
  }

  get mobileFormRules() {
    return {
      mobile: [FORM_RULES.required, FORM_RULES.mobile],
      username: [FORM_RULES.required, FORM_RULES.username],
      captcha: [FORM_RULES.required],
      smsCode: [FORM_RULES.required],
    }
  }

  get resetFormRules() {
    const passwordDiffCheck = {
      trigger: 'blur',
      validator: (rule: any, value: string, cb: any) => {
        if (this.resetForm.firstPassword != this.resetForm.secondPassword) {
          cb(new Error('两次输入的密码不一致'));
        }
        else {
          cb();
        }
      },
    };
    return {
      firstPassword: [
        FORM_RULES.required, 
        FORM_RULES.password,
      ],
      secondPassword: [
        FORM_RULES.required,
        FORM_RULES.password,
        passwordDiffCheck,
      ],
    };
  }

  get viewMeta() {
    return {breadcrumb: false};
  }

  async onResetTypeChange() {
    if (this.$refs.mobileForm) {
      await this.$refs.mobileForm.resetFields();
    }
    if(this.$refs.emailForm) {
      await this.$refs.emailForm.resetFields();
    }
  }

  get isMobileFormShow() {
    return this.selectedResetPasswordType.includes('手机') && !this.isVerified;
  }

  get isEmailFormShow() {
    return this.selectedResetPasswordType.includes('邮箱') && !this.isVerified;
  }

  getVisibleState(itemIndex: number) {
    if (itemIndex == 0) {
      return this.selectedResetPasswordType.includes('邮箱') && this.isEmailSend ? 'visible' : 'hidden'; 
    }
    if (itemIndex == 1) {
      return this.selectedResetPasswordType.includes('手机') && !this.isVerified? 'visible' : 'hidden';
    }
  }

  async getCaptcha() {
    try {
      const {captcha_img, captcha_key} = await api.ApiService.getCaptcha();
      this.captchaKey = captcha_key;
      this.captchaImg = captcha_img;
    } catch(err) {
      console.log(err);
    }
  }

  async sendSms() {
    const {mobileForm} = this;
    const {username, mobile} = mobileForm;
    const mobile_regex = RegExp(/(^(1)\d{10}$)|(^(\+\d{1,3}) \d{4,12}$)/);
    if (!mobile_regex.test(mobile)) {
      return;
    }
    try {
      await api.ApiService.sendResetPasswordSms(mobile, username);
      this.$Message.success('成功发送短信');
    } catch(err) {
      console.log(err);
      this.$Message.error('发送短信失败');
    }
  }

  async handleVerifySms() {
    this.$refs.mobileForm.validate(async (valid) => {
      if (valid) {
        const {mobileForm} = this;
        const {mobile, smsCode} = mobileForm;
        try {
          const {sms_token} = await api.ApiService.verifySmsWithType(mobile, smsCode, 'reset_password');

          this.mobileForm.smsToken = sms_token;
          this.isVerified = 'sms';
        } catch(err) {
          console.log(err);
          this.$Message.error('重置密码失败');
        }
      }
    });
  }

  async sendEmail() {
    const {emailForm} = this;
    const {username, email} = emailForm;
    try {
      await api.ApiService.sendResetEmail(username, email);
      this.$Message.success('成功发送邮件');
      this.isEmailSend = true;
    } catch(err) {
      console.log(err);
      this.$Message.error('发送邮件失败');
    }
  }

  async resetPassword() {
    if (this.isVerified === 'sms') {
      const {mobileForm, resetForm} = this;
      const {username, mobile, smsToken} = mobileForm;
      const {firstPassword} = resetForm;
      try {
        await api.UCenter.resetPassword({
          sms_token: smsToken,
          new_password: firstPassword,
          username,
          mobile,
        });
        this.$Message.success('成功重置密码');
        this.$app.goHome();
      } catch(err) {
        console.log(err);
        this.$Message.error('重置密码失败');
      }
    }
    else {
      const {emailForm, resetForm} = this;
      const {email, emailToken} = emailForm;
      const {firstPassword} = resetForm;
      try {
        await api.UCenter.resetPassword({
          email_token: emailToken,
          new_password: firstPassword,
          email,
        });
        this.$Message.success('成功重置密码');
        this.$app.goHome();
      } catch(err) {
        console.log(err);
        this.$Message.error('重置密码失败');
      }
    }
  }

  handleResetPassword() {
    this.$refs.resetForm.validate((valid) => {
      if (valid) {
        this.resetPassword();
      }
    });
  }

  handleSendEmail() {
    this.$refs.emailForm.validate((valid) => {
      if (valid) {
        this.sendEmail();
      }
    });
  }

  handleBack() {
    this.isVerified = '';
  }

  created() {
  
    if (this.$app.metaInfo!.account.support_email) {
      this.resetPasswordType.push('邮箱重置');
    }

    if (this.$app.metaInfo!.account.support_mobile) {
      this.resetPasswordType.push('手机号重置');
    }
    this.selectedResetPasswordType = this.resetPasswordType[0];
    if (this.$route.query.email_token) {
      this.handleEmailResetPassword(this.$route.query.email_token as string);
    }
  }

  async handleEmailResetPassword(token: string) {
    try {
      const {email, username, name} = await api.ApiService.verifyEmail(token, 'reset_password');
      this.emailForm.email = email;
      this.emailForm.username = username;
      this.emailForm.emailToken = token;
      this.isVerified = 'email';
    } catch(err) {
      console.log(err);
      this.$Message.error('验证邮箱失败');
    }
  }
}
