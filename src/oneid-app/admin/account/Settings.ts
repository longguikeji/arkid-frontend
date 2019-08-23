import {Vue, Component} from 'vue-property-decorator';
import './Settings.less';
import {FORM_RULES} from '@/utils';
import {FreakConfig} from '@/models/config';
import * as api from '@/services/config';


const SMS_VENDORS = [
  {
    value: 'aliyun',
    label: '阿里云',
  },
];


@Component({
  template: html`
  <div class="ui-account-settings-page">
    <div v-if="registerOptions" class="ui-account-settings-page-wrapper">
      <div class="register-mode">
        <div class="label">
          设置是否开放注册
        </div>
        <div class="content">
          <div>
            请设置：
          </div>
          <div>
            <div @click="registerOptions.account.allowRegister = true">
              <Radio :value="registerOptions.account.allowRegister" size="large">是</Radio>
            </div>
            <div @click="registerOptions.account.allowRegister = false">
              <Radio :value="!registerOptions.account.allowRegister" size="large">否</Radio>
            </div>
          </div>
        </div>
      </div>
      
      <div class="register-type">
        <div class="label">
          <div>注册账号类型设置</div>
          <div>
            （设置用户注册账号时所用的用户名类型，至少选择一种，支持多选。默认状态下选择“个人邮箱注册”）
          </div>
        </div>
        
        <div class="content">
          <div>
            <Checkbox v-model="registerOptions.account.allowEmail" size="large" class="description">
              {{ \`使用个人邮箱（ \${registerOptions.account.allowRegister ? '注册 / ' : ''}登录 / 找回密码 ）\` }}
            </Checkbox>
            <div
              class="link"
              @click="editType = 'email'"
            >
              邮箱配置
            </div>
            <div :class="\`tag\${registerOptions.email.isValid ? ' tag-finished' : ''}\`">
              {{ registerOptions.email.isValid ? '已完成' : '未完成' }}
            </div>
          </div>
          <div>
            <Checkbox v-model="registerOptions.account.allowMobile" size="large" class="description">
              {{ \`使用手机号（ \${registerOptions.account.allowRegister ? '注册 / ' : ''}登录 / 找回密码 ）\` }}
            </Checkbox>
            <div
              class="link"
              @click="editType = 'mobile'"
            >
              短信配置
            </div>
            <div :class="\`tag\${registerOptions.mobile.isValid ? ' tag-finished' : ''}\`">
              {{ registerOptions.mobile.isValid ? '已完成' : '未完成' }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="register-submit">
        <Button @click="onSaveAccount" :loading="accountBtnLoading">保存修改</Button>
        <div><RouterLink :to="{name: 'admin.config'}">去配置自定义登录页面</RouterLink></div>
      </div>
    </div>
    <Drawer
      placement="right"
      v-model="showDrawer"
      :closable="false"
      :maskClosable="true"
      :transfer="true"
      className="register-edit"
    >
      <div slot="header" class="header">配置{{ editType === 'email' ? '邮箱' : '短信' }}</div>
      <div class="body">
        <Form
          v-if="editType === 'email'"
          ref="email"
          :model="registerOptions.email"
          :rules="emailRules"
          labelPosition="right"
          :labelWidth="130"
        >
          <FormItem prop="host" label="邮件服务地址：">
            <Input type="email" v-model="registerOptions.email.host" placeholder="填写邮件服务地址"></Input>
          </FormItem>
          <FormItem prop="port" label="邮件服务端口：">
            <Input type="text" v-model="registerOptions.email.port" placeholder="填写邮件服务端口"></Input>
          </FormItem>
          <FormItem prop="account" label="邮箱账号：">
            <Input type="text" v-model="registerOptions.email.account" placeholder="填写邮箱账号"></Input>
          </FormItem>
          <FormItem prop="password" label="邮箱密码：">
            <Input type="password"
              value="************"
              @on-focus="(e) => e.target.value = registerOptions.email.password"
              @on-blur="(e) => registerOptions.email.password = e.target.value"
              placeholder="填写邮箱密码"></Input>
          </FormItem>
        </Form>
        <Form
          v-if="editType === 'mobile'"
          ref="mobile"
          :model="registerOptions.mobile"
          :rules="mobileRules"
          labelPosition="right"
          :labelWidth="130"
        >
          <FormItem prop="vendor" label="短信服务商：">
            <Select v-model="registerOptions.mobile.vendor">
              <Option v-for="item in smsVendors" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem prop="accessKey" label="Access Key：">
            <Input type="text" v-model="registerOptions.mobile.accessKey" placeholder="填写 Access Key"></Input>
          </FormItem>
          <FormItem prop="accessSecret" label="Access Secret：">
            <Input type="password"
              value="************"
              @on-focus="(e) => e.target.value = registerOptions.mobile.accessSecret"
              @on-blur="(e) => registerOptions.mobile.accessSecret = e.target.value"
              placeholder="填写 Access Secret"></Input>
          </FormItem>
          <FormItem prop="template" label="短信模板：">
            <Input type="text" v-model="registerOptions.mobile.template" placeholder="填写短信模板"></Input>
          </FormItem>
          <FormItem prop="badging" label="短信落款：">
            <Input type="text" v-model="registerOptions.mobile.badging" placeholder="填写短信落款"></Input>
          </FormItem>
        </Form>
      </div>
      <div class="footer">
        <Button @click="onCancel">取消</Button>
        <Button @click="onSaveEmailOrMobile" :loading="emailOrMobileBtnLoading">保存</Button>
      </div>
    </Drawer>
  </div>
  `,
})
export default class Settings extends Vue {
  editType = null;
  accountBtnLoading = false;
  emailOrMobileBtnLoading = false;

  get showDrawer() {
    return !!this.editType;
  }
  set showDrawer(val: boolean) {
    if (!val) {
      this.editType = null;
    }
  }

  get smsVendors() {
    return SMS_VENDORS;
  }

  get emailRules() {
    return {
      host: [FORM_RULES.required],
      port: [FORM_RULES.required, FORM_RULES.port],
      account: [FORM_RULES.required, FORM_RULES.email],
    };
  };

  get mobileRules() {
    return {
      vendor: [FORM_RULES.required],
      accessKey: [FORM_RULES.required],
      template: [FORM_RULES.required],
      badging: [FORM_RULES.required],
    };
  };

  registerOptions: FreakConfig | null = null;

  async loadData() {
    const registerOptions = await api.FreakConfig.get();
    registerOptions.mobile.accessSecret = '';
    registerOptions.email.password = '';
    this.registerOptions = registerOptions;
  }

  mounted() {
    this.loadData();
  }

  onCancel() {
    this.showDrawer = false;
  }

  ctrlBtnLoading(type: string, active: boolean) {
    if (active) {
      if (type === 'account') {
        this.accountBtnLoading = true;
      } else {
        this.emailOrMobileBtnLoading = true;
      }
    } else {
      if (type === 'account') {
        this.accountBtnLoading = false;
      } else {
        this.emailOrMobileBtnLoading = false;
      }
    }
  }

  save(type: string) {
    this.ctrlBtnLoading(type, true);
    this.$nextTick(async () => {
      try {
        this.registerOptions = await api.FreakConfig.patch(this.registerOptions!.toData());
        this.ctrlBtnLoading(type, false);
        this.$nextTick(() => {this.showDrawer = false;});
        this.$nextTick(() => {this.$Message.success('保存成功');});
      } catch(error) {
        this.ctrlBtnLoading(type, false);
        this.$nextTick(() => {this.showDrawer = false;});
        this.$nextTick(() => {this.$Message.error('保存失败');});
      }
    });
  }

  onSaveEmailOrMobile() {
    if (this.editType) {
      this.$refs[this.editType].validate((valid: boolean) => {
        if (valid) {
          this.save('emailOrMobile');
        }
      });
    }
  }

  onSaveAccount() {
    if (!this.registerOptions!.account.allowEmail && !this.registerOptions!.account.allowMobile) {
      this.$Message.error('请选择一种注册类型');
      return;
    }
    if (this.registerOptions!.account.allowEmail && !this.registerOptions!.email.isValid) {
      this.$Message.error('邮箱配置不正确');
      return;
    }
    if (this.registerOptions!.account.allowMobile && !this.registerOptions!.mobile.isValid) {
      this.$Message.error('短信配置不正确');
      return;
    }
    this.save('account');
  }
}
