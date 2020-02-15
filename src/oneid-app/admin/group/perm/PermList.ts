import * as model from '@/models/oneid'
import * as api from '@/services/oneid'
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import './PermList.less'

/* tslint:disable:max-classes-per-file */
@Component({
  template: html`
  <div class="ui-permlist-comp">
    <div class="ui-permlist-comp--header">
      <img :src="app.logo ? $fileUrl(app.logo) : defaultLogo" class="app-logo"/>
      <span class="app-name">{{ app.name }}</span>
    </div>
    <div class="ui-permlist-comp--body">
      <div class="perm-title">应用访问权限</div>
      <Table
        v-if="permList"
        :data="permList.filter(i => i.action === 'access')"
        :columns="columns"
        class="table"
      />
      <div class="perm-title">应用内权限</div>
      <Table
        v-if="permList"
        :data="permList.filter(i => i.action !== 'access')"
        :columns="columns"
        class="table"
      />
    </div>
  </div>
  `,
})
export default class PermList extends Vue {
  @Prop({type: Object, required: true}) app!: model.App
  @Prop({type: String}) groupId?: string
  @Prop({type: String}) username?: string

  defaultMetaNode: model.Node|null = null
  customMetaNode: model.Node|null = null

  permList: model.Permission[]|null = null
  defaultLogo: string = require('../../../../assets/icons/icon-applicationlist@2x.png')

  get columns() {
    return this.username ? [
      {title: '权限ID', key: 'uid', width: 140},
      {title: '权限名称', key: 'name', width: 140},
      {title: '分组权限', minWidth: 140, render: this.renderSourceCell, align: 'center'},
      {title: '个人权限', minWidth: 140, render: this.renderOperateCell, align: 'center'},
      {title: '权限结果', width: 100, render: this.renderResultCell, align: 'center'},
    ] : [
      {title: '权限ID', key: 'uid', width: 140},
      {title: '权限名称', key: 'name', width: 140},
      {title: '分组权限', minWidth: 140, render: this.renderOperateCell, align: 'center'},
      {title: '权限结果', width: 100, render: this.renderResultCell, align: 'center'},
    ]
  }

  async refresh() {
    await this.loadPermList()
  }

  async loadMetaNodes() {
    const [defaultMetaNode, customMetaNode] = await api.Node.metaNode(await this.$app.org())
    this.defaultMetaNode = defaultMetaNode
    this.customMetaNode = customMetaNode
  }

  async loadPermList() {
    if (!this.groupId && !this.username) {
      return
    }
    const {groupId, username, app} = this
    const {results: permList, count: total} = groupId
      ? await api.Perm.groupPermList(groupId, {appId: app.uid})
      : await api.Perm.userPermList(username!, {appId: app.uid})

    this.permList = permList.map(i => ({
      ...i.perm,
      locked: i.locked,
      status: i.status,
      value: i.value,
      node_perm_value: i.node_perm_value,
    }))
  }

  renderSourceCell(h: Vue.CreateElement, {row: perm}: model.Permission) {
    return h(SourceCell, {
      props: {
        value: perm.node_perm_value,
        username: this.username,
        permId: perm.uid,
        defaultMetaNode: this.defaultMetaNode,
        customMetaNode: this.customMetaNode,
      },
    })
  }

  renderOperateCell(h: Vue.CreateElement, {row: perm}: model.Permission) {
    return h(OperateCell, {
      props: {permId: perm.uid, status: perm.status},
      on: {'on-click': (val: string) => {
        const status = Math.floor(Number(val))
        if (status !== perm.status) {
          this.updateOwerPerm(perm.uid, status)
        }
      }},
    })
  }

  renderResultCell(h: Vue.CreateElement, {row: perm}: model.Permission) {
    return h('span', perm.value ? '是' : '否')
  }

  async updateOwerPerm(permId: string, status: number) {
    this.$Loading.start()
    try {
      if (this.username) {
        await api.Perm.updateUserPerm(this.username, permId, status)
      } else {
        await api.Perm.updateNodePerm(this.groupId!, permId, status)
      }
      this.$Loading.finish()
      this.refresh()
    } catch (e) {
      this.$Loading.error()
      this.refresh()
    }
  }

  async mounted() {
    await this.loadMetaNodes()
    await this.loadPermList()
  }
}

@Component({
  template: html`
  <div class="ui-operate-cell">
    <span class="white-space"></span>
    <span class="text">{{ text }}</span>
    <Dropdown
      @on-click="val => $emit('on-click', val)"
      :transfer="true"
      placement="bottom-start"
      trigger="click"
      class="dropdown"
    >
      <a href="javascript: void(0)">
        设置
        <Icon type="md-arrow-dropdown" size="18"></Icon>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem name="1">是</DropdownItem>
        <DropdownItem name='-1'>否</DropdownItem>
        <DropdownItem name='0'>默认</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
  `,
})
class OperateCell extends Vue {
  @Prop({type: String, required: true}) permId!: string
  @Prop({type: Number, required: true}) status!: number

  get text() {
    return this.status === 1 ? '是'
      : this.status === -1 ? '否'
      : this.status === 0 ? '默认'
      : ''
  }
}

@Component({
  template: html`
  <div class="ui-source-cell">
    <span class="white-space"></span>
    <span class="text">{{ text }}</span>
    <Poptip
      width="240"
      class="poptip"
      popper-class="poptip"
      :transfer="true"
      @on-popper-show="onPopperShow"
    >
      <span class="poptip-btn">查看来源</span>
      <div class="ui-poptip-content" slot="content" v-if="source">
        <ul v-for="metaNodes in [defaultMetaNode.children, customMetaNode.children]">
          <li class="flex-row" v-for="metaNode in metaNodes">
            <div class="meta-node-name">
              <span>{{ metaNode.name }}:</span>
            </div>
            <div>
              <span
                class="node-name"
              >
                {{ source.filter(i => i.nodeSubject === metaNode.nodeSubject).map(i => i.name).join(', ') }}
              </span>
            </div>
          </li>
        </ul>
      </div>
    </Poptip>
  </div>
  `,
})
class SourceCell extends Vue {
  @Prop({type: Boolean}) value?: boolean
  @Prop({type: String, required: true}) username!: string
  @Prop({type: String, required: true}) permId!: string
  @Prop({type: model.Node, required: true}) defaultMetaNode!: model.Node
  @Prop({type: model.Node, required: true}) customMetaNode!: model.Node

  get text() {
    return this.value ? '是' : '否'
  }

  source: Array<{
    name: string,
    id: string,
    nodeSubject: string,
  }>|null = null

  async loadSource() {
    const data = await api.User.retrievePerm(this.username, this.permId)
    const source = data.source.map(i => ({
      nodeSubject: i.node_subject,
      id: i.node_uid,
      name: i.name,
    }))
    this.source = source
  }

  onPopperShow() {
    if (!this.source) {
      this.loadSource()
    }
  }

  mounted() {
    // this.loadSource();
  }
}
