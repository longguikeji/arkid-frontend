import {Vue, Component, Prop} from 'vue-property-decorator';
import * as api from '@/services/oneid';

@Component({
  template: html`
  <div class="ui-workspace-userinfo-reset-email">
    <span class="title">修改个人邮箱</span>
    <Form
      ref="form"
      :model="form"
      :rules="rules"
      labelPosition="right"
      :labelWidth="120"
      class="form">
      <FormItem prop="email" label="新的个人邮箱">
        <div class="flex-row">
          <Input
            type="email"
            v-model="form.email"
            placeholder="输入邮箱"
            class="input"
          />
          <Button :disabled="disabled" @click="doSendEmail" class="send-email-btn">发送验证邮件</Button>
        </div>
      </FormItem>
      <FormItem>
        <Alert show-icon v-if="isOk" class="alert">
          一封邮件已经发到了您的个人邮箱。请查看邮件，依照指示完成更改
        </Alert>
      </FormItem>
    </Form>
  </div>
  `,
})
export class ResetEmail extends Vue {
  @Prop({type: String, required: true}) password!: string;

  form = {
    email: '',
  };
  rules = {
    email: [{
      trigger: 'blur',
      validator: (rule: any, value: string, cb: any) => {
        const regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (regex.test(value)) {
          cb();
        } else {
          cb(new Error('请填写符合格式的邮箱'));
        }
      },
    }],
  };
  isOk = false;

  async doSendEmail() {
    const isValid = await this.$refs.form.validate();
    if (!isValid) {
      return;
    }
    try {
      await api.ApiService.sendEmailToUpdateEmail(this.form.email, this.password);
      this.isOk = true;
    } catch(e) {
      this.$Message.error('发送失败');
    }
  }
}


@Component({
  template: html`
  <div class="ui-reset-email-callback-page">
    <div class="ui-reset-email-callback-page-wrapper" v-if="email">
      <Icon type="md-checkmark-circle" size="60" color="#52C41A" class="icon"/>
      <span class="title">恭喜您！个人邮箱修改完成</span>
      <span class="info">您的个人邮箱现在已修改为 {{ email.email }}</span>
      <Button type="primary" @click="close" class="btn">关闭本页（{{ countDown }} s）</Button>
    </div>
  </div>
  `,
})
export class ResetEmailCallback extends Vue {
  token = '';
  email: {
    email: string;
    username: string;
    name: string;
  }|null = null;
  interval: any;
  countDown = 20;

  async loadData() {
    try {
      const email = await api.ApiService.retrieveEmailInfoToUpdateEmail(this.token);
      await api.User.updateEmail(this.token);
      this.email = email;
      this.$nextTick(() => this.startCountDown());
    } catch(e) {
      console.log(e);
    }
  }

  startCountDown() {
    this.interval = setInterval(() => {
      this.countDown--;
      if (this.countDown === 0) {
        this.close();
      }
    }, 1000);
  }

  close() {
    this.clear();
    this.$router.replace({name: 'workspace.userinfo'});
  }

  clear() {
    clearInterval(this.interval);
    this.interval = null;
  }

  created() {
    const {email_token: token} = this.$route.query;
    if (token) {
      this.token = token as string;
    }
  }

  mounted() {
    if (this.token) {
      this.loadData();
    } else {
      this.$router.replace({name: 'workspace.userinfo'});
    }
  }

  destroyed() {
    this.clear();
  }
}
