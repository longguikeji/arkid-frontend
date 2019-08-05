import {Vue, Component} from 'vue-property-decorator';
import {sideMenu} from './menu';
import {User} from '@/models/oneid';
import * as api from '@/services/oneid';
import * as configApi from '@/services/config';
// import {Message, Form} from 'iview';

type Form = any;
type Message = any;

@Component({
  template: html`
  <div class="lg-ws-mobile-page flex-col flex-auto" style="height: 0;">
    <div class="quit" @click="quit" v-if="isNext">
      <Icon type="ios-close" size="24" color="#F5222D"></Icon>
      <span>放弃修改</span>
    </div>
    <div class="form-wrapper" v-if="!isNext">
      <Form
        v-if="stepOneForm"
        :model="stepOneForm"
        :rules="stepOneRules"
        :labelWidth="100"
        labelPosition="right"
        class="form"
        ref="stepOneForm"
        key="stepOneForm"
      >
        <FormItem>
          <div class="tips">
            <Icon type="ios-information-circle" size="18" color="#1890FF" class="icon-info"></Icon>
            <p>换绑主管理账号，需要验证当前主管理账号的身份</p>
          </div>
        </FormItem>
        <FormItem prop="name" label="当前管理员">
          <div>{{ stepOneForm.name }}</div>
        </FormItem>
        <FormItem prop="mobile" label="手机号">
          <div class="flex-row">
            <Input type="text" v-model="stepOneForm.mobile" disabled></Input>
            <Button @click="doOldMobileSendSms" class="send-btn">获取验证码</Button>
          </div>
        </FormItem>
        <FormItem prop="smsCode" label="验证码">
          <Input type="text" v-model="stepOneForm.smsCode" placeholder="请填写验证码"></Input>
        </FormItem>
      </Form>
      <Button type="primary" @click="doNext" :loading="isSaving" class="submit-btn">下一步</Button>
    </div>

    <div class="form-wrapper" v-if="isNext">
      <Form
        v-if="stepTwoForm"
        :model="stepTwoForm"
        :rules="stepTwoRules"
        :labelWidth="100"
        labelPosition="left"
        class="form"
        ref="stepTwoForm"
        key="stepTwoForm"
      >
        <FormItem>
          <div class="tips">
            <Icon type="ios-information-circle" size="18" color="#1890FF" class="icon-info"></Icon>
            <p>修改完成后，绑定的安全手机号也会随之修改</p>
          </div>
        </FormItem>
        <FormItem prop="name" label="新的主管理员">
          <Select :value="stepTwoForm.username" filterable placement="bottom" @on-change="onStepTwoUserChange">
            <Option v-for="item in userList" :value="item.username" :key="item.username">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="mobile" label="手机号">
          <div class="flex-row">
            <Input type="text" v-model="stepTwoForm.mobile" disabled></Input>
            <Button @click="doNewMobileSendSms" class="send-btn">获取验证码</Button>
          </div>
        </FormItem>
        <FormItem prop="smsCode" label="验证码">
          <Input type="text" v-model="stepTwoForm.smsCode" placeholder="请填写验证码"></Input>
        </FormItem>
      </Form>
      <Button type="primary" @click="doSave" :loading="isSaving" class="submit-btn">完成</Button>
    </div>
  </div>
  `,
})
export default class Admin extends Vue {
  $Message!: Message;
  $refs!: {
    stepOneForm: Form,
    stepTwoForm: Form,
  };
  user: User|null = null;
  userList: User[]|null = null;
  isNext = false;
  stepOneForm: {name: string, mobile: string, smsCode: string}|null = null;
  stepTwoForm: {username: string, mobile: string, smsCode: string}|null = null;
  stepOneSmsToken: string|null = null;
  stepTwoSmsToken: string|null = null;

  get viewMeta() {
    return {
      breadcrumb: [
        {label: '设置', path: {name: 'oneid.config'}},
        '更换主管理员',
      ],
      sideMenu: {
        menus: sideMenu.menus,
        activeName: 'oneid.config.admin',
      },
    };
  }

  get required() {
    return {required: true, message: '必填项', trigger: 'blur'};
  }

  get stepOneRules() {
    return {
      name: this.required,
      mobile: this.required,
      smsCode: this.required,
    };
  }
  get stepTwoRules() {
    return {
      username: this.required,
      mobile: this.required,
      smsCode: this.required,
    };
  }

  mounted() {
    this.loadStepOneData();
    this.loadStepTwoData();
  }

  async loadStepOneData() {
    const user = await api.UCenter.retrieve();

    // TODO (kaishun): move the below into `models/oneid.ts`
    const userData = {...user, uuid: user.id};
    delete userData.id;
    this.user = User.fromData(userData);

    this.stepOneForm = {...this.user, smsCode: ''};
  }

  async loadStepTwoData() {
    const {results: userList} = await api.User.list();
    this.userList = userList;
    this.stepTwoForm = {username: '', mobile: '', smsCode: ''};
  }

  doOldMobileSendSms() {
    this.sendSms(this.user!.mobile);
  }
  doNewMobileSendSms() {
    this.sendSms(this.stepTwoForm!.mobile);
  }

  async sendSms(mobile: string) {
    try {
      await api.ApiService.sendSmsWithoutCaptcha(mobile);
    } catch (e) {
      this.$Message.error('发送失败');
    }
  }

  async doNext() {
    const isValid = await this.$refs.stepOneForm.validate();
    if (!isValid) {
      return;
    }
    const {mobile} = this.user!;
    const {smsCode} = this.stepOneForm!;

    try {
      const {sms_token} = await api.ApiService.verifySms(mobile, smsCode);
      this.stepOneSmsToken = sms_token;
      this.isNext = true;
    } catch(e) {
      this.$Message.error('验证码错误');
    }
  }

  onStepTwoUserChange(username: string) {
    const user = this.userList!.find(user => user.username === username);
    this.stepTwoForm = {...this.stepTwoForm!, mobile: user!.mobile};
  }

  async doSave() {
    const isValid = await this.$refs.stepTwoForm.validate();
    if (!isValid) {
      return;
    }

    const {username, mobile, smsCode} = this.stepTwoForm!;

    try {
      const {sms_token} = await api.ApiService.verifySms(mobile, smsCode);
      this.stepTwoSmsToken = sms_token;
    } catch(e) {
      this.$Message.error('验证码错误');
      return;
    }

    const {stepOneSmsToken, stepTwoSmsToken} = this;
    try {
      await configApi.Config.updateAdmin(username, stepOneSmsToken!, stepTwoSmsToken!);
      this.$Message.success('更新成功');
      this.$app.logout();
    } catch(e) {
      this.$Message.error('更新失败');
    }
  }

  quit() {
    this.isNext = false;
    this.stepTwoForm = null;
  }
}
