import { Node, Permission } from '@/models/oneid'
import * as api from '@/services/oneid'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import './EditUserPerm.less'

@Component({

  template: html`
  <div>
    <Modal
      v-model="showUserModal"
      :title="userEditTitle"
      ok-text="确定"
      :closable="false"
      @on-ok="onSaveUser"
      className="ui-admin-apps-user"
      width="800"
    >
      <div class="ui-choose-base--wrapper">
        <div class="ui-choose-base--left">
          <div class="select-all flex-row">
            <h3 class="title">权限结果列表:</h3>
            <Checkbox @on-change="selectAll">全选</Checkbox>
          </div>
          <Input v-model='searchUser' search clearable placeholder="搜索账号" class="search" @on-change="onUserSearchChange"/>
          <CheckboxGroup v-if="currentPerm" v-model="checkedUsers" :style="{'margin-top': '20px'}">
            <CellGroup>
              <Cell
                v-for="item in userList.filter(o => !o.hide)"
                :name="item.uid"
                class="check-li flex-row"
              >
                <span>{{ item.name }}</span>
                <Checkbox :key="item.id" :label="item.username" :disabled="getDisableStatus(item)" class="flex-row" >
                  <span></span>
                </Checkbox>
              </Cell>
            </CellGroup>
          </CheckboxGroup>
        </div>
        <div class="ui-choose-base--right">
          <div class="clear-list flex-row">
            <h3 class="title">已在{{ columnName }}内:</h3>
            <a @click="clearCheckList">全部清除</a>
          </div>
          <ul class="selection">
            <li v-for="item in checkedUserList"
              :key="item.username"
              @click="unCheckOrUnSelect(item)"
              class="nameline flex-row"
            >
              <span class="flex-auto">{{ item.name }}</span>
              <Icon type="ios-close-circle-outline" size="18" />
            </li>
          </ul>
        </div>
      </div>
    </Modal>

    <Modal
      v-model="showResultDetailModal"
      :closable="false"
      className="ui-admin-apps-user"
      width="800"
    >
      <div slot="header" class="ui-choose-base--head flex-row">
        <h2 class="head-title">详细信息</h2>
        <span class="perm-name">权限名: {{ currentPerm? currentPerm.name : '' }}</span>
      </div>
      <div class="ui-choose-base--wrapper">
        <div class="ui-choose-base-result--left">
          <h3 class="title">结果名单:</h3>
          <CellGroup @on-click="onSelectUser" class="name-list">
            <Cell
              v-for="item in allAccounts"
              :name="item.uid"
              class="name-line flex-row"
              :title="item.name"
              :selected="userId === item.uid"
            />
          </CellGroup>
        </div>
        <div class="ui-choose-base--right">
          <div class="right-title flex-row">
            <h3 class="title">权限来源:</h3>
            <Tooltip class="title-tooltip">
              <XIcon name="doubt" size="14px"/>
              <div slot="content">权限来源包括以下两类：
                <p>1. 用户所在分类或上级分类被列入白名单</p>
                <p>2. 用户自身被列入白名单</p>
              </div>
            </Tooltip>
          </div>
          <div v-if="userFullInfo">
            <p class="perm-source" >账号: <span class="perm-value" v-if="userFullInfo.status == '1'">是</span></p>
            <ul
              class="perm-source"
              v-if="userFullInfo"
              v-for="metaNode in [...defaultMetaNode.children, ...customMetaNode.children]"
            >
              <li class="flex-row">
                <div class="meta-node-name"><span>{{ metaNode.name }}:</span></div>
                <div>
                  <span
                    v-for="node in userFullInfo.filter(i => i.nodeSubject === metaNode.nodeSubject)"
                    class="node-name"
                  >
                    {{ node.name }}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="onOk">确定</Button>
      </div>
    </Modal>
  </div>
  `,
})
export default class Perm extends Vue {
  currentPerm: Permission|null = null
  operationName = '新建权限'
  allAccounts = null
  showResultDetailModal = false
  showUserModal = false
  userFullInfo = null
  userList = []
  checkedUserList = []
  columnName = ''
  searchUser = ''
  userEditTitle = ''
  userId = ''
  defaultMetaNode: Node|null = null
  customMetaNode: Node|null = null

  get checkedUsers() {
    const users = this.checkedUserList.map(o => o.username)
    return users
  }

  set checkedUsers(userNames: string) {
    this.checkedUserList = this.userList.filter(
      o => userNames.includes(o.username),
    )
  }

  selectAll(flag: boolean) {
    if (!flag) {
      this.checkedUserList = []
    }
    else {
    this.checkedUserList = this.userList.filter(o =>
      this.columnName.includes('白名单')?
      (!this.currentPerm!.reject_owners.map(u => u.uid).includes(o.username)) :
      (!this.currentPerm!.permit_owners.map(u => u.uid).includes(o.username)))
    }
  }

  async onSaveUser() {
    // tslint:disable:variable-name
    const users_status = this.checkedUserList.map(o =>({uid: o.username, status: this.columnName.includes('白名单')?1:-1}))
    const origin_checked_users = this.columnName.includes('白名单')?this.currentPerm!.permit_owners: this.currentPerm!.reject_owners
    origin_checked_users.map(o => {
      if(users_status.filter(item => item.uid === o.uid).length === 0) {
        users_status.push({uid: o.uid, status: 0})
      }
    })

    const params = {
      user_perm_status: users_status,
    }
    await api.Perm.partialUpdateOwnersStatus(this.currentPerm!.uid, this.currentPerm!.subject, params)
    this.$emit('on-save')
  }

  getDisableStatus(item) {
    return this.columnName.includes('白名单')?
    this.currentPerm!.reject_owners.map(o => o.uid).includes(item.username) : this.currentPerm!.permit_owners.map(o => o.uid).includes(item.username)
  }

  onOk() {
    this.showResultDetailModal = false
  }

  clearCheckList() {
    this.checkedUserList = []
  }

  async showResultDetail(type: string, perm: Permission) {
    const permUserList = await api.Perm.permResultList(perm.uid, {
      owner_subject: type,
      page_size: 1000000,
      value: true,
    })
    this.allAccounts = permUserList.data
    this.currentPerm = perm
    this.showResultDetailModal = true
  }

  async showEdit(columnName: string, perm: Permission) {
    this.currentPerm = perm
    this.columnName = columnName
    const owners = await api.Perm.permResultList(perm.uid, {
      owner_subject: 'user',
      page_size: 1000000,
      status: columnName.includes('白名单') ? 1 : -1,
    })
    const resultData = await api.User.list({page: 1, pageSize:1000000})
    resultData.results.map(o => o.hide = false)
    this.userList = resultData.results
    this.userEditTitle = '账号' + columnName
    if (columnName.includes('白名单')) {
      this.currentPerm.permit_owners = owners.data
      this.checkedUserList = this.userList.filter(o => this.currentPerm!.permit_owners.map(p => p.uid).includes(o.username))
    }
    else {
      this.currentPerm.reject_owners = owners.data
      this.checkedUserList = this.userList.filter(o => this.currentPerm!.reject_owners.map(p => p.uid).includes(o.username))
    }
    this.showUserModal = true
  }

  onUserSearchChange() {
    this.userList.map(o => {
      if(o.name.includes(this.searchUser)) {
        o.hide = false
      }
      else {
        o.hide = true
      }
    })
  }

  async onSelectUser(uid: string) {
    const permSources = await api.User.retrievePerm(uid, this.currentPerm!.uid)
    const source = permSources.source.map(i => ({
      nodeSubject: i.node_subject,
      id: i.node_uid,
      name: i.name,
    }))
    source.status = permSources.status
    this.userFullInfo = source

    this.userId = uid
  }

  unCheckOrUnSelect(item: string) {
    const index = this.checkedUserList.indexOf(item)
    this.checkedUserList.splice(index, 1)
  }

  mounted() {
    this.loadMetaNodes()
  }

  async loadMetaNodes() {
    const [defaultMetaNode, customMetaNode] = await api.Node.metaNode(await this.$app.org())
    this.defaultMetaNode = defaultMetaNode
    this.customMetaNode = customMetaNode
  }
}
