import * as model from '@/models/oneid'
import ChooseNode from '@/oneid-app/comps/choose/Choose'
import * as api from '@/services/oneid'
import { FORM_RULES } from '@/utils'
import { Component, Prop, Vue } from 'vue-property-decorator'
import './EditNodePerm.less'

const required = {required: true, message: 'Required', trigger: 'blur'}

@Component({
  components: {
    ChooseNode,
  },
  template: html`
  <div>
    <Drawer
      placement="right"
      v-model="showDrawer"
      :closable="false"
      :maskClosable="true"
      :width="drawerWidth"
      className="edit-perm"
    >
      <div class="title">{{ operationName }}</div>
      <Form
        v-if="showDrawer"
        :model="currentPerm"
        :rules="rules"
        labelPosition="right"
        :labelWidth="100"
        ref="form"
        class="form"
      >
        <FormItem prop="name" :model="operationName" label="权限名称" v-if="operationName === '重命名'">
          <Input v-model="currentPerm.name" type="text"></Input>
        </FormItem>
        <FormItem prop="name" label="权限名称" v-if="operationName === '新建权限'">
          <Input type="text" v-model="currentPerm.name" placeholder="填写权限名称"></Input>
        </FormItem>
        <FormItem prop="sub_account.domain" label="登录地址" v-if="operationName.indexOf('账号') > 0">
          <Input type="text" v-model="currentPerm.sub_account.domain" placeholder="填写登录地址"></Input>
        </FormItem>
        <FormItem prop="sub_account.username" label="用户名" v-if="operationName.indexOf('账号') > 0">
          <Input type="text" v-model="currentPerm.sub_account.username" placeholder="填写用户名"></Input>
        </FormItem>
        <FormItem prop="sub_account.password" label="登录密码" v-if="operationName.indexOf('账号') > 0">
          <Input type="password" v-model="currentPerm.sub_account.password" placeholder="填写登录密码"></Input>
        </FormItem>
      </Form>
      <div class="drawer-footer flex-row flex-auto">
        <Button type="default" @click="doCancel">取消</Button>
        <Button type="primary" @click="doSave" :loading="isSaving">保存</Button>
      </div>
    </Drawer>

    <ChooseNode
      :title="nodeTitle"
      v-if="chooseNode"
      v-bind="chooseNode"
      ref="chooseNode"
      @on-ok="onChooseNodeOk"
    />
  </div>
  `,
})
export default class EditPerm extends Vue {
  $refs!: {
    chooseNode: ChooseNode,
  }
  drawerWidth = 580
  drawerClassName = 'lg-edit-dept'
  labelPosition = 'left'
  labelWidth = 85

  currentPerm: model.Permission|null = null
  rules = {
    name: [FORM_RULES.required],
    'sub_account.domain': [FORM_RULES.required],
    'sub_account.username': [FORM_RULES.required],
    'sub_account.password': [FORM_RULES.required],
  }
  showDrawer = false
  isSaving = false
  operationName = '新建权限'
  showModal = false
  nodeTitle = ''
  appUID = ''
  metaNodes: model.Node[] = []
  modalMetaNode: model.Node|null = null
  user: model.User|null = null
  node: model.Node|null = null
  form: model.User|null = null

  chooseNode: {
    metaNode: Node;
    title: string;
    selectedIds: string[];
    checkedIds: string[];
    multiple: boolean;
  }|null = null

  async showEdit(columnName: string, node: model.Node, perm: model.Permission) {
    this.operationName = '编辑权限'
    this.currentPerm = perm
    this.modalMetaNode = node
    this.nodeTitle = this.modalMetaNode.name + columnName
    const owners = await api.Perm.permResultList(perm.uid, {
      uid: perm.uid,
      owner_subject: node.nodeSubject,
      page_size: 1000000,
      status: columnName.includes('白名单') ? 1 : -1,
    })
    if (columnName.includes('白名单')) {
      perm.permit_owners = owners.data
    }
    else {
      perm.reject_owners = owners.data
    }
    this.chooseNode = {
      title: `选择${this.modalMetaNode.name}`,
      metaNode: this.modalMetaNode,
      checkedIds: columnName.includes('白名单') ? perm.permit_owners.map(o => o.uid) : perm.reject_owners.map(o => o.uid),
      disabledIds: columnName.includes('白名单') ? perm.reject_owners.map(o => o.uid) : perm.permit_owners.map(o => o.uid),
      multiple: true,
    }
    this.$nextTick(() => this.$refs.chooseNode.show())
  }

  showAdd(appUID: string) {
    this.operationName = '新建权限'
    this.appUID = appUID
    this.currentPerm = model.Permission.fromData()
    this.showDrawer = true
  }

  showRename(perm: model.Permission) {
    this.currentPerm = perm
    this.operationName = '重命名'
    this.showDrawer = true
  }

  showAddAccount(appUID: string) {
    this.operationName = '新建账号'
    this.appUID = appUID
    this.currentPerm = model.Permission.fromData()
    this.showDrawer = true
  }

  showEditAccount(perm: model.Permission) {
    this.operationName = '编辑账号'
    this.currentPerm = perm
    this.showDrawer = true
  }

  async create() {
    try {
      await api.Dept.create(this.form)
      this.$Message.success('创建成功')
    } catch (e) {
      this.$Message.error('创建失败')
    }
  }

  async edit() {
    try {
      await api.Dept.partialUpdate(this.form)
      this.$Message.success('编辑成功')
    } catch (e) {
      this.$Message.error('编辑失败')
    }
  }

  async remove() {
    try {
      await api.Dept.remove(this.form)
      this.$Message.success('删除成功')
      this.form = null
      this.showDrawer = false
      this.$emit('on-save')
    } catch (e) {
      this.$Message.error('删除失败')
    }
  }

  async doSave() {
    // tslint:disable:prefer-switch
    if (this.operationName === '新建权限') {
      await api.Perm.create({scope: this.appUID, name: this.currentPerm.name})
    }
    else if (this.operationName === '重命名') {
      await api.Perm.partialUpdate(this.currentPerm.uid, {name: this.currentPerm.name})
    }
    else if (this.operationName === '新建账号') {
      await api.Perm.create({scope: this.appUID, sub_account: this.currentPerm.sub_account})
    }
    else if (this.operationName === '编辑账号') {
      await api.Perm.partialUpdate(this.currentPerm.uid, {sub_account: this.currentPerm.sub_account})
    }

    this.showDrawer = false
    this.$emit('on-save')
  }

  doCancel() {
    this.showDrawer = false
  }

  async loadMetaNodes() {
    const [defaultMetaNode, customMetaNode] = await api.Node.metaNode()
    this.metaNodes = [...defaultMetaNode.children, ...customMetaNode.children]
  }

  async onChooseNodeOk(checkedNodes: model.Node[]) {
    // tslint:disable:variable-name
    const nodes_status = checkedNodes.map(o =>({uid: o.id, status: this.nodeTitle.includes('白名单')?1:-1}))
    const origin_checked_nodes = this.nodeTitle.includes('白名单')?this.currentPerm.permit_owners: this.currentPerm.reject_owners
    origin_checked_nodes.map(o => {
      if(nodes_status.filter(item => item.uid === o.uid).length === 0) {
        nodes_status.push({uid: o.uid, status: 0})
      }
    })

    const params = {
      node_perm_status: nodes_status,
    }
    await api.Perm.partialUpdateOwnersStatus(this.currentPerm.uid, this.currentPerm.nodeSubject, params)
    this.$emit('on-save')
  }
}
