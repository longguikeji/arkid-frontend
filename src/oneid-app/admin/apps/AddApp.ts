import {App, OAuthData, SamlData} from '@/models/oneid'
import * as api from '@/services/oneid'
import { Component, Vue, Watch } from 'vue-property-decorator'
import './AddApp.less'

@Component({
  template: html`
  <div>
    <Modal
      v-model="showAdd"
      fullscreen
      :closable="false"
      class="ui-admin-apps-app-add flex-auto flex-col"
    >
      <div slot="header" class="header flex-row">
        <div class="header-title">
          <h2 v-if="isNew">添加应用</h2>
          <h2 v-else>协议配置</h2>
        </div>
      </div>
      <div class="body">
        <Form ref="form" class="form" :rules="rules" :label-width="300" :model="app">
          <h2 class="subtitle">应用基础信息</h2>
          <FormItem prop="name" label="应用名称:">
            <Input v-model="app.name" placeholder="填写应用名称"></Input>
          </FormItem>
          <FormItem label="应用LOGO:">
            <div class="set-image-area flex-row">
              <div class="flex-col">
                <p>图片长宽比例为1:1，大小不超过1M，主视觉元素在图形范围内清晰可见</p>
                <div class=" flex-row">
                  <Upload name="file"
                    v-bind="upload"
                    :on-success="onUploadSuccess"
                    :show-upload-list="false"
                    class="upload"
                  >
                    <Button>点击上传</Button>
                  </Upload>
                  <a v-if="app.logo" @click="resetLogo" type="default">使用默认LOGO</a>
                </div>
              </div>
              <img class="logo" :src="siteLogo" />
            </div>
          </FormItem>
          <FormItem label="主页地址:">
              <Input v-model="app.index" placeholder="填写主页地址"></Input>
          </FormItem>
          <FormItem label="备注:">
              <Input v-model="app.remark" placeholder="自定义备注"></Input>
          </FormItem>
          <h2 class="subtitle">协议配置</h2>
          <FormItem label="选择协议:">
            <Select placeholder="请选择" multiple v-model="app.auth_protocols">
              <Option v-for="item in authTypes" :key="item" :value="item">{{ item }}</Option>
            </Select>
          </FormItem>
          <Tabs :animated="false" class="protocol-tab" type="card" v-if="app.auth_protocols.length != 0">
            <TabPane v-if="app.auth_protocols.includes(authTypes[0]) && app.oauth_app" :label="authTypes[0]" :name="authTypes[0]">
              <FormItem v-if="app.oauth_app.client_id" label="client_id:">
                <p>{{app.oauth_app.client_id}}</p>
              </FormItem>
              <FormItem v-if="app.oauth_app.client_secret" label="client_secret:">
                <p class="client-secret">{{app.oauth_app.client_secret}}</p>
              </FormItem>
              <FormItem prop="oauth_app.client_type" label="client_type:">
                <Select placeholder="请选择" v-model="app.oauth_app.client_type">
                  <Option v-for="item in clientTypes" :key="item" :value="item">{{ item }}</Option>
                </Select>
              </FormItem>
              <FormItem prop="oauth_app.authorization_grant_type" label="authorization_grant_type:">
                <Select placeholder="请输入" v-model="app.oauth_app.authorization_grant_type">
                  <Option v-for="item in grantTypes" :key="item" :value="item">{{ item }}</Option>
                </Select>
              </FormItem>
              <FormItem prop="oauth_app.redirect_uris" label="redirect_uris:">
                <Input placeholder="请输入" type="textarea" :autosize="true" v-model="app.oauth_app.redirect_uris"
                  placeholder="请输入 redirect_uris...">
                </Input>
              </FormItem>
            </TabPane>
            <TabPane v-if="app.auth_protocols.includes(authTypes[1])" :label="authTypes[1]" :name="authTypes[1]">
              <div v-if="app.ldap_app && app.ldap_app.more_detail" >
                <FormItem v-for="item in app.ldap_app.more_detail" :label="item.name">
                  <p>{{ item.value }}</p>
                </FormItem>
              </div>
            </TabPane>
            <TabPane v-if="app.auth_protocols.includes(authTypes[2])" :label="authTypes[2]" :name="authTypes[2]">
              <div v-if="app.http_app && app.http_app.more_detail" >
                <FormItem v-for="item in app.http_app.more_detail" :label="item.name">
                  <p>{{ item.value }}</p>
                </FormItem>
              </div>
            </TabPane>
            <TabPane v-if="app.auth_protocols.includes(authTypes[3]) && app.saml_app" :label="authTypes[3]" :name="authTypes[3]">
              <FormItem prop="saml_app.entity_id" label="entity_id:">
                <Input type="text" v-model="app.saml_app.entity_id" placeholder="请输入 entity_id..."></Input>
              </FormItem>
              <FormItem prop="saml_app.acs" label="acs:">
                <Input type="text" v-model="app.saml_app.acs" placeholder="请输入 acs..."></Input>
              </FormItem>
              <FormItem prop="saml_app.sls" label="sls:">
                <Input type="text" v-model="app.saml_app.sls" placeholder="请输入 sls..."></Input>
              </FormItem>
              <FormItem prop="saml_app.cert" label="证书(x509):">
                <Input type="textarea" v-model="app.saml_app.cert" placeholder="请输入 证书内容..."></Input>
              </FormItem>
              <FormItem prop="saml_app.xmldata" label="上传元数据文档:">
                <Upload
                  name="xmlFile"
                  action=""
                  accept=".xml"
                  :show-upload-list="false"
                  :before-upload="handleBeforeUpload"
                  :max-size="100"
                >
                  <Button>上传文件</Button>
                </Upload>
              </FormItem>
            </TabPane>
          </Tabs>
        </Form>
      </div>
      <div slot="footer" class="footer flex-row">
        <div class="buttons flex-row">
          <Button v-if="!isNew" type="error" @click="remove">删除</Button>
          <div v-else type="default"></div>
          <div class="buttons-right">
            <Button type="default" @click="doCancel">取消</Button>
            <Button type="primary" @click="doSave">确定</Button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
  `,
})

export default class AddApp extends Vue {
  showAdd: boolean = false
  app: App|null = null

  get rules() {
    const required = {required: true, message: '必填项', trigger: 'blur'}
    return {
      'name': [required],
      'oauth_app.redirect_uris': [required],
    }
  }
  authTypes = ['OAuth 2.0', 'LDAP', 'HTTP', 'SAML']
  selectedAuthTypes?: string[] = []
  clientTypes = ['confidential', 'public']
  grantTypes = ['authorization-code', 'implicit', 'password', 'client']
  isNew: boolean = true

  constructor() {
    super()
    const newApp = new App()
    newApp.oauth_app = new OAuthData()
    newApp.saml_app = new SamlData()
    this.app = newApp
  }

  onProtocolsChange(newVal: string[], oldVal: string[]) {
    const oauthType = this.authTypes[0]
    const addOauth = newVal.includes(oauthType) && !oldVal.includes(oauthType)
    const removeOauth = !newVal.includes(oauthType) && oldVal.includes(oauthType)
    if (addOauth) {
      this.app!.oauth_app = new OAuthData()
    }
    if (removeOauth) {
      this.app!.oauth_app = null
    }

    const samlType = this.authTypes[3]
    const addSaml = newVal.includes(samlType) && !oldVal.includes(samlType)
    const removeSaml = !newVal.includes(samlType) && oldVal.includes(samlType)
    if (addSaml) {
      this.app!.saml_app = new SamlData()
    }
    if (removeSaml) {
      this.app!.saml_app = null
    }
  }

  showModal(app?: App|null) {
    if (app) {
      this.app = app
      this.isNew = false
    } else {
      this.isNew = true
    }
    this.$watch('app.auth_protocols', this.onProtocolsChange, {deep: true})
    this.showAdd = true
  }

  resetLogo() {
    this.app!.logo = ''
  }

  onUploadSuccess(resp: {file_name: string}) {
    this.app!.logo = resp.file_name
  }

  get upload() {
    return {
      headers: api.File.headers(),
      action: api.File.baseUrl(),
    }
  }
  get siteLogo() {
    const icon = this.app!.logo
    return icon ? api.File.url(icon) : require('@/assets/icons/auto/defaultapp.svg')
  }

  async create() {
    try {
      await api.App.create(this.getAppParams())
      this.$Message.success('创建成功')
    } catch(err) {
      this.$Message.error('创建失败')
      return
    }
  }

  getAppParams() {
    const params = {
      name: this.app!.name,
      remark: this.app!.remark,
      logo: this.app!.logo,
      auth_protocols: this.app!.auth_protocols,
      index: this.app!.index,
    }

    if (this.app!.auth_protocols.includes(this.authTypes[0])) {
      params.oauth_app = {
        redirect_uris: this.app!.oauth_app!.redirect_uris,
        client_type: this.app!.oauth_app!.client_type,
        authorization_grant_type: this.app!.oauth_app!.authorization_grant_type,
      }
    } else {
      params.oauth_app = null
    }

    if (this.app!.auth_protocols.includes(this.authTypes[1])) {
      params.ldap_app = new Object()
    } else {
      params.ldap_app = null
    }

    if (this.app!.auth_protocols.includes(this.authTypes[2])) {
      params.http_app = new Object()
    } else {
      params.http_app = null
    }

    if (this.app!.auth_protocols.includes(this.authTypes[3])) {
      params.saml_app = {
        entity_id: this.app!.saml_app!.entity_id,
        acs: this.app!.saml_app!.acs,
        sls: this.app!.saml_app!.sls,
        cert: this.app!.saml_app!.cert,
        xmldata: this.app!.saml_app!.xmldata,
      }
    } else {
      params.saml_app = null
    }

    return params
  }

  async edit() {
    try {
      await api.App.partialUpdate(this.app!.uid, this.getAppParams())
      this.$Message.success('保存成功')
    } catch(err) {
      this.$Message.error('保存失败')
      return
    }
  }

  async remove() {
    const {uid: id} = this.app
    try {
      await api.App.remove(id)
      this.$Message.success('删除成功')
    } catch(err) {
      this.$Message.error('删除失败')
      return
    }
    this.$emit('on-change')
    this.showAdd = false
  }

  async doSave() {
    const valid = await this.$refs.form.validate()
    if (!valid) {
      this.$Message.error('请正确填写表单')
      return
    }

    if (this.isNew) {
      await this.create()
    } else {
      await this.edit()
    }
    this.$emit('on-change')
    this.showAdd = false
  }

  doCancel() {
    this.showAdd = false
    this.$emit('on-change')
  }

  handleBeforeUpload(file: File) {
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = (e) => {
      this.app!.saml_app!.xmldata = e.target!.result as string
    }
    return false
  }
}
