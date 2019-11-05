import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import * as api from '@/services/oneid';
import {Form} from 'iview/types/index';
import {FORM_RULES} from '@/utils';
import './UserCommon.less';


@Component({
  template: html`
<SimpleFrame>
  <div class="ui-signup-page flex-col" v-if="!isExpired">
  <div v-if="isActivate" class="activate-area">
          <div class="activate-name flex-row"><p>Hi, &nbsp;&nbsp;{{activateName}}</p></div>
          <div class="activate-content flex-row"><p>管理员邀请您加入{{siteName}}, 请完成账号激活流程</p></div>
        </div>
    <div class="flex-row">
      <div class="ui-signup-page--form-wrapper">
        
        <div>
          <Form v-if="!emailForm.email" :label-width="120">
            <FormItem :label="radioGroupName">
              <RadioGroup class="flex-row" v-model="selectedRegisterType" @on-change="onRegisterTypeChange">
                <Radio v-for="item in registerType" :label="item">
                  <span>{{ item }}</span>
                </Radio>
              </RadioGroup>
            </FormItem>
          </Form>
        </div>
        <div>
          <Form 
            v-if="isEmailSendFormShow" 
            :model="emailSendForm" 
            :label-width="120" 
            :rules="emailFormRules"
            ref="emailSendForm"
          >
            <FormItem prop="email" label="个人邮箱">
              <Input type="text" :disabled="isActivate" v-model="emailSendForm.email" placeholder="输入个人邮箱账号"></Input>
            </FormItem>
            <div :style="{'visibility': isEmailSend ? 'visible' : 'hidden' }" class="form-alert-line flex-row">
              <Alert closable class="form-alert" show-icon>邮件已发送，请登录您的个人邮箱，按照邮件内容进行注册</Alert>
            </div>
            <FormItem prop="sendbutton">
              <Button class="simpleframe-btn" :disabled="isEmailSend" type="primary" @click="sendEmail" style="width: 100%;">
              {{ isEmailSend ? "邮件已发送" : "发送验证邮件" }}
              </Button>
            </FormItem>
          </Form>
        </div>
        <div>
          <Form 
            v-if="isMobileFormShow" 
            :label-width="120" 
            :model="mobileForm" 
            class="mobile-form"
            :rules="mobileFormRules"
            ref="mobileForm"
          >
            <FormItem prop="mobile" label="手机号">
              <Input type="text" :disabled="isActivate" v-model="mobileForm.mobile" placeholder="请输入 手机号码..."></Input>
            </FormItem>
            <FormItem prop="smsCode" label="验证码">
              <Input type="text" v-model="mobileForm.smsCode" placeholder="请输入 短信验证码..."></Input>
            </FormItem>
          </Form>
        </div>
        <div>
          <Form v-if="emailForm.email" :label-width="120" :model="emailForm" :rules="emailFormRules" ref="emailForm">
            <FormItem prop="email" label="您的注册邮箱">
              <Input type="text" disabled v-model="emailForm.email"></Input>
            </FormItem>
          </Form>
        </div>
        <div>
          <Form 
            v-if="isCommonFormShow" 
            :label-width="120"
            :model="commonRegisterForm" 
            :rules="commonRegisterFormRules"
            ref="commonRegisterForm"
          >
            <FormItem prop="username" label="设置用户名">
              <Input type="text" v-model="commonRegisterForm.username" placeholder="设置用户名"></Input>
            </FormItem>
            <FormItem prop="password" label="设置密码">
              <Input type="password" v-model="commonRegisterForm.password" placeholder="设置登录密码..."></Input>
            </FormItem>
            <FormItem prop="passwordAgain" label="确认密码">
              <Input type="password" v-model="commonRegisterForm.passwordAgain" placeholder="确认登录密码..."></Input>
            </FormItem>
            <FormItem prop="submit">
              <Button type="primary" @click="handleSubmit" style="width: 100%;" class="simpleframe-btn register-button">完成注册</Button>
            </FormItem>
          </Form>
        </div>
        <RouterLink :to="{name: 'oneid.login'}" class="simpleframe-route go-to">返回登录页</RouterLink>
      </div>
      <div 
        :style="{'visibility': isMobileFormShow? 'visible' : 'hidden' }" 
        class="form-right-area flex-col">
        <a @click="sendSms" class="simpleframe-route">获取验证码</a>
        <Icon class="mobile-check"
          v-if="isValidMobile === true"
          type="ios-checkmark-circle" color="#52C41A" size="18"
        />
        <Icon class="mobile-check"
          v-if="isValidMobile === false"
          type="ios-close-circle" color="#F5222D" size="18"
        />   
      </div>
    </div>
  </div>
  <div v-else>邀请链接已失效，请您重新获取！</div>
</SimpleFrame>
  `,
})
export default class UserSignUp extends Vue {
  $refs!: {
    emailForm: Form,
    emailSendForm: Form,
    mobileForm: Form,
    commonRegisterForm: Form,
  };
  isEmailSend: boolean = false;
  isActivate = false;
  isExpired = false;
  selectedRegisterType: string = '';
  isMobileRegisterAvailable = true;
  isEmailRegisterAvailable = true;
  radioGroupName = '选择方式:';
  inviteCode: string = '';
  activateName = '';
  emailSendForm = {
    email: '',
    sendbutton: '',
  }

  emailForm = {
    email: '',
    emailToken: '',
  };

  mobileForm = {
    mobile: '',
    smsCode: '',
    smsToken: '',
  };

  commonRegisterForm = {
    username: '',
    password: '',
    passwordAgain: '',
  };

  registerType: string[] = [];
  isValidMobile: boolean|null = null;

  get siteName() {
    return this.$app.metaInfo!.org.nameCn;
  }

  get isEmailSendFormShow() {
    return this.registerType && (this.selectedRegisterType && this.selectedRegisterType.includes('邮箱')) && !this.emailForm.email;
  }

  get isCommonFormShow() {
    return  this.emailForm.email || (this.selectedRegisterType && this.selectedRegisterType.includes('手机'));
  }

  get isMobileFormShow() {
    return this.registerType && (this.selectedRegisterType && this.selectedRegisterType.includes('手机'));
  }

  get mobileFormRules() {
    return {
      mobile: [FORM_RULES.required, FORM_RULES.mobile],
    }
  }

  get emailFormRules() {
    return {
      email: [FORM_RULES.required, FORM_RULES.email],
    }
  }

  get commonRegisterFormRules() {
    const passwordDiffCheck = {
      trigger: 'blur',
      validator: (rule: any, value: string, cb: any) => {
        if (this.commonRegisterForm.password != this.commonRegisterForm.passwordAgain) {
          cb(new Error('两次输入的密码不一致, 请重新输入'));
        }
        else {
          cb();
        }
      },
    };

    return {
      password: [FORM_RULES.required],
      passwordAgain: [FORM_RULES.required, passwordDiffCheck],
      username: [FORM_RULES.required, FORM_RULES.username],
    }
  }

  get viewMeta() {
    return {
      breadcrumb: false,
    };
  }

  @Watch('mobileForm.smsCode')
  onSmsCodeChange(val: string) {
    if (/\d{6}$/.test(val)) {
      this.verifyMobile();
    } else {
      this.isValidMobile = false;
    }
  }

  onRegisterTypeChange() {
    if (this.$refs.mobileForm) {
      this.$refs.mobileForm.resetFields();
    }
    if(this.$refs.emailSendForm) {
      this.$refs.emailSendForm.resetFields();
    }
  }

  async handleSubmit() {
    const isValid = await this.$refs.commonRegisterForm.validate();
    if (!isValid) {
      return;
    }
    try {
      this.$Loading.start();
      const {username, password} = this.commonRegisterForm;
      if (this.emailForm.email) {
        this.handleEmailSubmit(username, password);
      }
      else {
        if (!this.isValidMobile) {
          return;
        }
        this.handleMobileSubmit(username, password);
      }
      this.$Loading.finish();
      this.$router.push({name: 'oneid.registersuccess', query: {next: String(this.$route.query.next) || ''}});
    } catch (e) {
      this.$Loading.error();
    }
  }

  async handleEmailSubmit(username: string, password: string) {
    const {emailToken} = this.emailForm;
    try {
      if (this.isActivate) {
        await api.UCenter.activateWithInviteCode({
          username,
          password,
          email_token: emailToken,
          key: this.inviteCode,
        });
      }
      else {
        await api.UCenter.register({
          email_token: emailToken,
          password,
          username,
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  async handleMobileSubmit(username: string, password: string) {
    const {smsToken} = this.mobileForm;
    try {
      if (this.isActivate) {
        await api.UCenter.activateWithInviteCode({
          username,
          password,
          sms_token: smsToken,
          key: this.inviteCode,
        });
      } else {
        await api.UCenter.register({
          sms_token: smsToken,
          password,
          username,
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  async verifyMobile() {
    const {mobile, smsCode} = this.mobileForm;
    this.$Loading.start();
    try {
      if (this.isActivate) {
        const {sms_token} = await api.ApiService.verifySmsWithType(mobile, smsCode, 'activate_user');
        this.mobileForm.smsToken = sms_token;
      }
      else {
        const {sms_token} = await api.ApiService.verifySmsWithType(mobile, smsCode, 'register');
        this.mobileForm.smsToken = sms_token;
      }
      this.$Loading.finish();
      this.isValidMobile = true;
    } catch (e) {
      this.isValidMobile = false;
      this.$Loading.error();
    }
  }

  created() {
    if (this.$route.query.email_token) {
      this.handleEmailRegisterVerify(this.$route.query.email_token as string);
    }
    else if (this.$route.query.key) {
      this.handleActivateVerify(this.$route.query.key as string);
    }
    else if(this.$route.params.activate_email_token) {
      this.handleEmailActivateVerify(this.$route.params.activate_email_token);
    }
    else {
      if (this.$app.metaInfo!.account) {
        this.registerType = [];
        this.isEmailRegisterAvailable = this.$app.metaInfo!.account.support_email_register;
        this.isMobileRegisterAvailable = this.$app.metaInfo!.account.support_mobile_register;
        if (this.isEmailRegisterAvailable) {
          this.registerType.push('邮箱注册');
        }
        if (this.isMobileRegisterAvailable) {
          this.registerType.push('手机号注册');
        }
        this.selectedRegisterType = this.registerType[0];
      }
    }
  }

  mounted() {
    if (this.$app.isLogin) {
      this.$app.goHome();
    }
  }

  async handleActivateVerify(key: string) {
    try {
      this.radioGroupName = '选择激活方式:';
      this.registerType = []; 

      this.isActivate = true;
      const {private_email, name, mobile} = await api.UCenter.verifyInvite(key);
      this.activateName = name;
      if (private_email) {
        this.isEmailRegisterAvailable = true;
        this.emailSendForm.email = private_email;
        this.inviteCode = key;
        this.registerType.push('个人邮箱');
      }
      else {
        this.isEmailRegisterAvailable = false;
      }

      if (mobile) {
        this.isMobileRegisterAvailable = true;
        this.mobileForm.mobile = mobile;
        this.registerType.push('手机号');
        this.inviteCode = key;
      }
      else {
        this.isMobileRegisterAvailable = false;
      }
      this.selectedRegisterType = this.registerType[0];
      
    } catch(err) {
      const {key: errKey} = err.data
      if (errKey[0] === 'expired') {
        this.isExpired = true
      } else {
        this.$Message.error('验证邀请码失败');
      }
    }
  }

  async handleEmailRegisterVerify(token: string) {
    try {
      const {email} = await api.ApiService.verifyEmail(token, 'register');
      this.emailForm.email = email;
      this.emailForm.emailToken = token;
    } catch(err) {
      console.log(err);
      this.$Message.error('验证邮箱失败');
    }
  }

  async handleEmailActivateVerify(token: string) {
    try {
      const {email, name, key} = await api.ApiService.verifyEmail(token, 'activate_user');
      this.emailForm.email = email;
      this.activateName = name;
      this.emailForm.emailToken = token;
      this.inviteCode = key;
      this.isActivate = true;
    } catch(err) {
      console.log(err);
      this.$Message.error('验证邮箱失败');
    }
  }

  async sendEmail() {
    const isValid = await this.$refs.emailSendForm.validate();
    if (!isValid) {
      return;
    }
    const {email} = this.emailSendForm;
    try {
      if (this.isActivate) {
        await api.ApiService.sendActivateEmail(this.inviteCode);
      }
      else {
        await api.ApiService.sendRegisterEmail(email);
      }
      this.$Message.success('成功发送邮件');
      this.isEmailSend = true;
    } catch(err) {
      console.log(err);
      this.$Message.error('发送邮件失败');
    }
  }

  async sendSms() {
    const isValid = await this.$refs.mobileForm.validate();
    if (!isValid) {
      return;
    }
    const {mobile} = this.mobileForm;
    try {
      if (this.isActivate) {
        await api.ApiService.sendActivateSms(this.inviteCode);
      }
      else {
        await api.ApiService.sendRegisterSms(mobile);
      }
      this.$Message.success('成功发送短信');
    } catch(err) {
      console.log(err);
      this.$Message.error('发送短信失败');
    }
  }
}
