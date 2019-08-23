import {Vue, Component, Prop} from 'vue-property-decorator';
import * as api from '@/services/oneid';
import * as model from '@/models/oneid';
import {FORM_RULES} from '@/utils';

@Component({
  template: html`
  <div class="ui-workspace-userinfo-reset-mobile-wrapper">
    <div class="ui-workspace-userinfo-reset-mobile">
      <span class="title">修改手机号</span>
      <Form
        ref="form"
        :model="form"
        :rules="rules"
        labelPosition="right"
        :labelWidth="120"
        class="form"
      >
        <FormItem prop="mobile" label="手机号码">
          <div class="flex-row">
            <Input type="text" v-model="form.mobile" placeholder="填写手机号码"/>
            <Button :disabled="sendSmsBtnDisabled" @click="doSendSms" class="send-sms-btn">发送短信</Button>
          </div>
        </FormItem>
        <FormItem prop="smsCode" label="验证码">
          <Input type="text" v-model="form.smsCode" placeholder="填写验证码"/>
        </FormItem>
        <FormItem>
          <div class="flex-col">
            <Button type="primary" @click="doSubmit" class="submit-btn">确认修改</Button>
            <a href="javascript: void(0)" @click="$emit('on-hide')" class="back-link">返回编辑个人信息</a>
          </div>
        </FormItem>
      </Form>
    </div>
  </div>
  `,
})
export default class ResetMobile extends Vue {
  @Prop({type: Object, required: true}) user!: any;
  @Prop({type: String, required: true}) password!: string;
  form = {
    mobile: '',
    smsCode: '',
  };
  rules = {
    mobile: [FORM_RULES.required, FORM_RULES.mobile],
    smsCode: [FORM_RULES.required],
  };

  get sendSmsBtnDisabled() {
    const enabled = /^(1)\d{10}$/.test(this.form.mobile);
    return !enabled;
  }

  async doSendSms() {
    try {
      await api.ApiService.sendSmsToUpdateMobile(this.user.username, this.form.mobile, this.password);
      this.$Message.success('发送短信成功');
    } catch(e) {
      if (e.status === 400) {
        if (e.data.mobile && e.data.mobile.includes('unsupported')) {
          this.$Message.error('未配置短信服务');
          return;
        }
        if (e.data.mobile && e.data.mobile.includes('existed')) {
          this.$Message.error('该手机号码已存在');
          return;
        }
      }
      this.$Message.error('发送短信失败');
    }
  }

  async doSubmit() {
    const isValid = await this.$refs.form.validate();
    if (!isValid) {
      return;
    }

    const {password} = this;
    const {mobile, smsCode} = this.form;
    try {
      const {sms_token} = await api.ApiService.verifySmsToUpdateMobile(mobile, smsCode);
      await api.User.updateMobile(sms_token);
      this.$Message.success('保存成功');
    } catch(e) {
      this.$Message.error('保存失败');
    }
  }
}
