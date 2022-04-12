import * as model from '@/models/oneid'
import AddNewField from '@/oneid-app/comps/AddNewField'
import * as config from '@/services/config'
import * as api from '@/services/oneid'
import {FORM_RULES, getRegexRule} from '@/utils'
import {cloneDeep} from 'lodash'
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'

import ChooseNode from '@/oneid-app/comps/choose/Choose'
import ResetPassword from '@/oneid-app/comps/ResetPassword'
import './EditUser.less'

interface InternationalMobile {
  number_length: number
  start_digital: number[]
  state_code: string
}

@Component({
  components: {
    ChooseNode,
    ResetPassword,
    AddNewField,
  },
  template: html`
  <div>
    <Drawer
      placement="right"
      v-model="showDrawer"
      :closable="false"
      :maskClosable="true"
      :width="580"
      :transfer="true"
      className="ui-edit-user"
    >
      <div class="title">
        <span>{{ isNew ? "添加账号" : "编辑账号" }}</span>
        <Button @click="doConvertExternOrIntra()">切换为{{ isExternUser ? "内部" : "外部" }}账号</Button>
      </div>
      <Form
        v-if="showDrawer && rules"
        :model="form"
        :rules="rules"
        labelPosition="right"
        :labelWidth="100"
        ref="form"
        class="form"
      >
        <FormItem prop="username" label="用户名" v-if="isNew">
          <Input type="text" v-model="form.username" :maxlength="16" placeholder="请输入 用户名"></Input>
        </FormItem>
        <FormItem prop="username" label="用户名" v-else>
          <Input type="text" v-model="form.username" :maxlength="16" placeholder="请输入 用户名" readonly></Input>
          </FormItem>
        <FormItem prop="name" label="姓名">
          <Input type="text" v-model="form.name" :maxlength="16" placeholder="请输入 姓名"></Input>
        </FormItem>
        <FormItem prop="password" label="登录密码">
          <Button type="primary" @click="showResetPassword()">设置/重置</Button>
          <div>一般用于新增账号时用户的快速激活，或用户无法重置密码时，管理员手动重置密码这两个场景</div>
        </FormItem>
        <FormItem prop="mobile" label="手机">
          <div class="international-mobile flex-row">
            <Select v-model="areaCode" clearable placeholder="请选择 国际区号">
              <Option v-for="item in internationalMobileList" :value="item.state_code" :key="item.state_code">{{ item.state_code }}</Option>
            </Select>
            <Input type="text" v-model="form.mobile" placeholder="请输入 手机"></Input>
          </div>
        </FormItem>
        <FormItem prop="privateEmail" label="个人邮箱">
          <Input type="text" v-model="form.privateEmail" placeholder="请输入 邮箱"></Input>
        </FormItem>

        <Divider>分组信息</Divider>

        <FormItem
          prop="nodes" :label="item.name"
          v-for="item in metaNodes" :key="item.id">
          <Input type="text"
            :value="form.nodes ? form.nodes.filter(i => i.nodeSubject === item.nodeSubject).map(i => i.name).join(',') : ''"
            @click.native="doShowModal(item)"
            readonly
            :placeholder="'请添加' + item.name"
           ></Input>
        </FormItem>

        <Divider>默认字段</Divider>

        <FormItem prop="employeeNumber" label="员工编号">
          <Input type="text" v-model="form.employeeNumber" placeholder="请输入 员工编号"></Input>
        </FormItem>

        <FormItem prop="email" label="企业邮箱">
          <Input type="text" v-model="form.email" placeholder="请输入 企业邮箱"></Input>
        </FormItem>

        <FormItem prop="gender" label="性别">
          <RadioGroup v-model="form.gender">
            <Radio :label="1">男</Option>
            <Radio :label="2">女</Option>
          </RadioGroup>
        </FormItem>

        <FormItem prop="hiredate" label="入职时间">
          <DatePicker format="yyyy/MM/dd" type="date" v-model="form.hiredate"></DatePicker>
        </FormItem>

        <FormItem prop="position" label="地址">
          <Input type="text" v-model="form.position" placeholder="请输入 地址"></Input>
        </FormItem>

        <FormItem prop="remark" label="备注">
          <Input type="text" v-model="form.remark" placeholder="请输入 备注"></Input>
        </FormItem>

        <Divider>自定义字段</Divider>

        <FormItem :key="field.uuid" v-for="field of customFields" :label="field.name">
          <Input type="text" v-model="form.custom_user[field.uuid]" :placeholder="'请输入'+field.name"></Input>
        </FormItem>

        <FormItem v-if="!isNew">
          <div>{{'注册时间：'+new Date(form.created).toLocaleString()}}</div>
          <div>{{'注册方式：'+form.originVerbose}}</div>
          <div v-if="form.isExternUser">外部账号</div>
          <div v-else>内部账号</div>
          <div v-if="form.isManager">子管理员</div>
        </FormItem>
      </Form>
      <div class="drawer-footer flex-row flex-auto">
        <Button type="default" @click="doCancel">取消</Button>
        <Button type="error" @click="remove" v-if="!isNew">删除</Button>
        <div class="flex-row flex-auto"></div>
        <Button type="primary" @click="openAddNewField">添加自定义字段</Button>
        <Button type="primary" @click="doSave()" :loading="isSaving">{{ isNew ? '添加' : '保存' }}</Button>
        <Button type="primary" @click="doSaveAndContinue()" :loading="isSaving" v-if="isNew">保存并继续添加</Button>
      </div>
    </Drawer>

    <ResetPassword
      ref="resetPassword"
      :username="form.username"
      :isNew="isNew"
      @confirm="getPassword"
    />

    <ChooseNode
      v-if="chooseNode"
      v-bind="chooseNode"
      ref="chooseNode"
      @on-ok="onChooseNodeOk"
    />
    <Modal v-model="isShowAddNewField" @on-visible-change="onAddNewFieldChange">
      <AddNewField :type="addNewFieldType"/>
    </Modal>
  </div>
  `,
})
export default class EditUser extends Vue {

  get rules() {
    const current = this.internationalMobileList.find((e: InternationalMobile) => e.state_code === this.areaCode)

    const mobileOrEmailRequiredRule = {
      trigger: 'blur',
      validator: (rule: string, value: string, cb: Function) => {
        if (this.form!.mobile || this.form!.privateEmail || this.form!.password) {
          cb()
        } else {
          cb(new Error('登录密码，手机号和个人邮箱至少填写一项'))
        }
      },
    }

    const mobileRule = current ?
      getRegexRule('手机号码格式有误', new RegExp(`^([${current.start_digital.join('')}])\\d{${current.number_length - 1}}$`))
      : FORM_RULES.mobile

    return {
      username: [FORM_RULES.required, FORM_RULES.username],
      name: [FORM_RULES.required],
      mobile: [mobileRule, mobileOrEmailRequiredRule],
      privateEmail: [FORM_RULES.email, mobileOrEmailRequiredRule],
    }
  }

  get isNew() {
    return !this.form!.id
  }

  get isExternUser() {
    return this.form!.isExternUser
  }
  $refs!: {
    chooseNode: ChooseNode,
    resetPassword: ResetPassword,
  }

  @Prop({type: model.User}) user?: model.User
  @Prop({type: model.Node}) node?: model.Node

  metaNodes: model.Node[] = []

  showDrawer: boolean = false
  form: model.User|null = null
  isSaving: boolean = false
  areaCode: string = ''
  internationalMobileList: InternationalMobile[] = []

  chooseNode: {
    metaNode: model.Node;
    title: string;
    multiple: boolean;
    checkedIds: string[];
  }|null = null

  isShowAddNewField = false
  get addNewFieldType(){
    if(this.isExternUser){
      return 'extern_user'
    }
    return 'user'
  }
  customFields:any[] = []
  openAddNewField() {
    this.isShowAddNewField = true
  }
  async onAddNewFieldChange() {
    this.customFields = await api.CustomFieldConfig.getList(this.addNewFieldType)
  }

  initForm() {
    const {user, node} = this
    if (user) {
      this.form = cloneDeep(user)
    } else {
      const form = new model.User()
      form.nodes = node ? [node] : []
      this.form = form
    }
  }

  async show() {
    this.showDrawer = true
  }

  async loadMetaNodes() {
    const [defaultMetaNode, customMetaNode] = await api.Node.metaNode()
    this.metaNodes = [...defaultMetaNode.children, ...customMetaNode.children]
  }

  async loadInternationalMobile() {
    const result = await config.Config.getInternationalMobile()
    this.internationalMobileList = result
    this.areaCode = ''

    result.forEach(item => {
      if(this.form!.mobile.indexOf(item.state_code) > 0) {
        this.areaCode = item.state_code
      }
    })

    this.form!.mobile = this.form!.mobile.replace(`+${this.areaCode} `, '')
  }

  showResetPassword() {
    this.$nextTick(() => this.$refs.resetPassword.show())
  }

  getPassword(data: {password: string, requireResetPassword: boolean}) {
    this.form!.password = data.password
    this.form!.requireResetPassword = data.requireResetPassword
    this.form!.hasPassword = true
  }

  doShowModal(metaNode: model.Node) {
    const checkedIds = this.form!.nodes!
      .filter(n => n.nodeSubject === metaNode.nodeSubject)
      .map(i => i.id)

    this.chooseNode = {
      metaNode,
      title: `选择${metaNode.name}`,
      multiple: true,
      checkedIds,
    }
    this.$nextTick(() => this.$refs.chooseNode.show())
  }

  onChooseNodeOk(checkedNodes: model.Node[]) {
    const {metaNode} = this.chooseNode!
    const {nodes} = this.form!

    this.form!.nodes = [
      ...nodes!.filter((i: model.Node) => i.nodeSubject !== metaNode!.nodeSubject),
      ...checkedNodes,
    ]
  }

  async remove() {
    this.$Loading.start()
    try {
      await api.User.remove(this.form)
      this.$Loading.finish()
      this.$emit('on-save')
      this.showDrawer = false
    } catch (e) {
      this.$Loading.error()
      this.$emit('on-save')
    }
  }

  async doSave(isNext: boolean = false) {
    const isValid = await this.$refs.form.validate()
    if (!isValid) {
      return
    }

    const user = cloneDeep(this.form!)
    if(this.form!.mobile) {
      user!.mobile = `+${this.areaCode} ${this.form!.mobile}`
    }

    this.$Loading.start()
    try {
      if (this.isNew) {
        await api.User.create(user)
      } else {
        await api.User.partialUpdate(user)
      }
      this.$Loading.finish()
      this.$Message.success('保存成功')

      if (isNext) {
        this.initForm()
      } else {
        this.showDrawer = false
      }
    } catch (e) {
      if (e.status === 400) {
        if (e.data.username && e.data.username.includes('existed')) {
          this.$Message.error('保存失败：用户名被占用')
        }
        if (e.data.username && e.data.username.includes('invalid')) {
          this.$Message.error('保存失败：非法用户名')
        }
        if (e.data.mobile && e.data.mobile.includes('existed')) {
          this.$Message.error('保存失败：手机号被占用')
        }
        if (e.data.email && e.data.email.includes('existed')) {
          this.$Message.error('保存失败：邮箱被占用')
        }
      }
      this.$Loading.error()
    }

    this.$emit('on-save')
  }

  async doConvertExternOrIntra() {
    this.form!.isExternUser = !this.form!.isExternUser
    try {
      if(this.form!.isExternUser) {
        await api.User.convertExtern(this.form!)
      } else {
        await api.User.convertIntra(this.form!)
      }
      this.$Message.success('切换成功')
    } catch(e) {
      this.$Message.success('切换失败')
    }
  }

  async doSaveAndContinue() {
    this.doSave(true)
  }

  doCancel() {
    this.showDrawer = false
  }

  async created() {
    this.initForm()

    this.customFields = await api.CustomFieldConfig.getList('user')
  }

  mounted() {
    this.loadMetaNodes()
    this.loadInternationalMobile()
  }
}
