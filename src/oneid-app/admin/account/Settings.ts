import {FreakConfig} from '@/models/config'
import * as api from '@/services/config'
import {FORM_RULES} from '@/utils'
import {Form} from 'iview/types/index'
import {Component, Vue} from 'vue-property-decorator'
import './Settings.less'

const SMS_VENDORS = [
  {
    value: 'aliyun',
    label: '阿里云',
  },
]

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

      <div class="thirdparty-login">
        <div class="label">
          设置是否开放第三方扫码登录
        </div>
        <div class="content">
          <div>
            <Checkbox v-model="registerOptions.account.allowDingQr" size="large" class="description">
              钉钉
            </Checkbox>
            <div class="link" @click="editType = 'ding'">
              钉钉配置
            </div>
            <div :class="\`tag\${registerOptions.ding.qrAppValid ? ' tag-finished' : ''}\`">
              {{ registerOptions.ding.qrAppValid ? '已完成' : '未完成' }}
            </div>
          </div>

          <div>
            <Checkbox v-model="registerOptions.account.allowAlipayQr" size="large" class="description">
              支付宝
            </Checkbox>
            <div class="link" @click="editType = 'alipay'">
              支付宝配置
            </div>
            <div :class="\`tag\${registerOptions.alipay.qrAppValid ? ' tag-finished' : ''}\`">
              {{ registerOptions.alipay.qrAppValid ? '已完成' : '未完成' }}
            </div>
          </div>

          <div>
            <Checkbox v-model="registerOptions.account.allowQqQr" size="large" class="description">
              QQ
            </Checkbox>
            <div class="link" @click="editType = 'qq'">
              QQ配置
            </div>
            <div :class="\`tag\${registerOptions.qq.qrAppValid ? ' tag-finished' : ''}\`">
              {{ registerOptions.qq.qrAppValid ? '已完成' : '未完成' }}
            </div>
          </div>

          <div>
            <Checkbox v-model="registerOptions.account.allowWechatQr" size="large" class="description">
              微信
            </Checkbox>
            <div class="link" @click="editType = 'wechat'">
              微信配置
            </div>
            <div :class="\`tag\${registerOptions.wechat.qrAppValid ? ' tag-finished' : ''}\`">
              {{ registerOptions.wechat.qrAppValid ? '已完成' : '未完成' }}
            </div>
          </div>

          <div>
            <Checkbox v-model="registerOptions.account.allowWechatWorkQr" size="large" class="description">
              企业微信
            </Checkbox>
            <div class="link" @click="editType = 'wechatWork'">
              企业微信配置
            </div>
            <div :class="\`tag\${registerOptions.wechatWork.qrAppValid ? ' tag-finished' : ''}\`">
              {{ registerOptions.wechatWork.qrAppValid ? '已完成' : '未完成' }}
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
      <div slot="header" class="header">配置
        {{ editType === 'email' ? '邮箱' :
           editType === 'ding' ? '钉钉' :
           editType === 'wechatWork' ? '企业微信' :
           editType === 'wechat' ? '微信' :
           editType === 'qq' ? 'QQ' :
           editType === 'alipay' ? '支付宝' : '短信'}}</div>
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
          </FormItem>
          <FormItem prop="template_i18n" label="国际短信模板：">
            <Input type="text" v-model="registerOptions.mobile.templateI18n" placeholder="填写国际短信模板"></Input>
          </FormItem>
          <FormItem prop="badging_i18n" label="国际短信落款：">
            <Input type="text" v-model="registerOptions.mobile.badgingI18n" placeholder="填写国际短信落款"></Input>
          </FormItem>
        </Form>

        <Form
          v-if="editType === 'ding'"
          ref="ding"
          :model="registerOptions.ding"
          :rules="dingRules"
          labelPosition="right"
          :labelWidth="130"
        >
          <FormItem prop="qrAppId" label="App Id：">
            <Input type="text" v-model="registerOptions.ding.qrAppId" placeholder="填写 App Id"></Input>
          </FormItem>
          <FormItem prop="qrAppSecret" label="App Secret：">
            <Input type="password"
              value="************"
              @on-focus="(e) => e.target.value = registerOptions.ding.qrAppSecret"
              @on-blur="(e) => registerOptions.ding.qrAppSecret = e.target.value"
              placeholder="填写 App Secret"></Input>
          </FormItem>
        </Form>

        <Form
          v-if="editType === 'alipay'"
          ref="alipay"
          :model="registerOptions.alipay"
          :rules="alipayRules"
          labelPosition="right"
          :labelWidth="130"
        >
          <FormItem prop="appId" label="App Id：">
            <Input type="text" v-model="registerOptions.alipay.appId" placeholder="填写 App Id"></Input>
          </FormItem>
          <FormItem prop="appPrivateKey" label="Private Key：">
            <Input type="password"
              value="************"
              @on-focus="(e) => e.target.value = registerOptions.alipay.appPrivateKey"
              @on-blur="(e) => registerOptions.alipay.appPrivateKey = e.target.value"
              placeholder="填写 App Private Key"></Input>
          </FormItem>
          <FormItem prop="alipayPublicKey" label="Alipay Public Key：">
            <Input type="textarea" :rows="8" v-model="registerOptions.alipay.alipayPublicKey"
              placeholder="填写 Alipay Public Key"></Input>
          </FormItem>
        </Form>

        <Form
          v-if="editType === 'qq'"
          ref="qq"
          :model="registerOptions.qq"
          :rules="qqRules"
          labelPosition="right"
          :labelWidth="130"
        >
          <FormItem prop="appId" label="App Id：">
            <Input type="text" v-model="registerOptions.qq.appId" placeholder="填写 App Id"></Input>
          </FormItem>
          <FormItem prop="appKey" label="App Key：">
            <Input type="password"
              value="************"
              @on-focus="(e) => e.target.value = registerOptions.qq.appKey"
              @on-blur="(e) => registerOptions.qq.appKey = e.target.value"
              placeholder="填写 App Key"></Input>
          </FormItem>
        </Form>

        <Form
          v-if="editType === 'wechat'"
          ref="wechat"
          :model="registerOptions.wechat"
          :rules="wechatRules"
          labelPosition="right"
          :labelWidth="130"
        >
          <FormItem prop="appId" label="App Id：">
            <Input type="text" v-model="registerOptions.wechat.appId" placeholder="填写 App Id"></Input>
          </FormItem>
          <FormItem prop="secret" label="Secret：">
            <Input type="password"
              value="************"
              @on-focus="(e) => e.target.value = registerOptions.wechat.secret"
              @on-blur="(e) => registerOptions.wechat.secret = e.target.value"
              placeholder="填写 Secret"></Input>
          </FormItem>
        </Form>

        <Form
          v-if="editType === 'wechatWork'"
          ref="wechatWork"
          :model="registerOptions.wechatWork"
          :rules="wechatWorkRules"
          labelPosition="right"
          :labelWidth="130"
        >
          <FormItem prop="corpId" label="Corp Id：">
            <Input type="text" v-model="registerOptions.wechatWork.corpId" placeholder="填写 Corp Id"></Input>
          </FormItem>
          <FormItem prop="agentId" label="Agent Id：">
            <Input type="text" v-model="registerOptions.wechatWork.agentId" placeholder="填写 Agent Id"></Input>
          </FormItem>
          <FormItem prop="secret" label="Secret：">
            <Input type="password"
              value="************"
              @on-focus="(e) => e.target.value = registerOptions.wechatWork.secret"
              @on-blur="(e) => registerOptions.wechatWork.secret = e.target.value"
              placeholder="填写 Secret"></Input>
          </FormItem>
        </Form>
      </div>
      <div class="footer">
        <Button @click="onCancel">取消</Button>
        <Button @click="onSaveConfigForm" :loading="saveBtnLoading">保存</Button>
      </div>
    </Drawer>
  </div>
  `,
})
export default class Settings extends Vue {
  editType: 'email'|'mobile'|'ding'|'alipay'|'wechatWork'|'wechat'|'qq'|null = null
  accountBtnLoading = false
  saveBtnLoading = false

  registerOptions: FreakConfig | null = null

  get showDrawer() {
    return !!this.editType
  }
  set showDrawer(val: boolean) {
    if (!val) {
      this.editType = null
    }
  }

  get smsVendors() {
    return SMS_VENDORS
  }

  get emailRules() {
    return {
      host: [FORM_RULES.required],
      port: [FORM_RULES.required, FORM_RULES.port],
      account: [FORM_RULES.required, FORM_RULES.email],
    }
  }

  get mobileRules() {
    return {
      vendor: [FORM_RULES.required],
      accessKey: [FORM_RULES.required],
      template: [FORM_RULES.required],
      badging: [FORM_RULES.required],
    }
  }

  get dingRules() {
    return {
      qrAppId: [FORM_RULES.required],
    }
  }

  get alipayRules() {
    return {
      appId: [FORM_RULES.required],
      alipayPublicKey: [FORM_RULES.required],
    }
  }

  get qqRules() {
    return {
      appId: [FORM_RULES.required],
    }
  }

  get wechatRules() {
    return {
      appId: [FORM_RULES.required],
    }
  }

  get wechatWorkRules() {
    return {
      corpId: [FORM_RULES.required],
      agentId: [FORM_RULES.required],
    }
  }

  async loadData() {
    const registerOptions = await api.FreakConfig.get()
    registerOptions.mobile.accessSecret = ''
    registerOptions.email.password = ''
    registerOptions.ding.qrAppSecret = ''
    registerOptions.alipay.appPrivateKey = ''
    registerOptions.wechatWork.secret = ''
    registerOptions.wechat.secret = ''
    registerOptions.qq.appKey = ''
    this.registerOptions = registerOptions
  }

  mounted() {
    this.loadData()
  }

  onCancel() {
    this.showDrawer = false
  }

  async save(fn: Function) {
    try {
      this.registerOptions = await fn()
      this.showDrawer = false
      this.$Message.success('保存成功')
    } catch(error) {
      this.showDrawer = false
      this.$Message.error('保存失败')
    }
  }

  onSaveConfigForm() {
    if (this.editType) {
      const ref = this.$refs[this.editType] as Form
      ref.validate((valid: boolean|void) => {
        if (valid) {
          this.saveConfig(this.editType as string)
        }
      })
    }
  }

  onSaveAccount() {
    const options = this.registerOptions!
    const {account} = options
    if (!account.allowEmail && !account.allowMobile) {
      this.$Message.error('请选择一种注册类型')
      return
    }
    if (account.allowEmail && !options.email.isValid) {
      this.$Message.error('邮箱配置不正确')
      return
    }
    if (account.allowMobile && !options.mobile.isValid) {
      this.$Message.error('短信配置不正确')
      return
    }
    if (account.allowDingQr && !options.ding.qrAppValid) {
      this.$Message.error('钉钉配置不正确')
      return
    }
    if (account.allowAlipayQr && !options.alipay.qrAppValid) {
      this.$Message.error('支付宝配置不正确')
      return
    }
    if (account.allowWechatWorkQr && !options.wechatWork.qrAppValid) {
      this.$Message.error('企业微信配置不正确')
      return
    }
    if (account.allowWechatQr && !options.wechat.qrAppValid) {
      this.$Message.error('微信配置不正确')
      return
    }
    if (account.allowQqQr && !options.qq.qrAppValid) {
      this.$Message.error('QQ配置不正确')
      return
    }
    this.saveConfig('account')
  }
  async saveConfig(type: string) {
    this.saveBtnLoading = true
    this.save(api.FreakConfig.patchConfig.bind(this, this.registerOptions, type))
    this.saveBtnLoading = false
  }
}
