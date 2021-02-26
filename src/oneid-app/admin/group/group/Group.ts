import {Node, TreeNode} from '@/models/oneid'
import GroupTree from '@/oneid-app/comps/GroupTree'
import * as api from '@/services/oneid'
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import UserList from '../user/UserList'
import Edit from './Edit'
import './Group.less'

@Component({
  components: {
    GroupTree,
    UserList,
    Edit,
  },
  template: html`
  <div class="flex-row flex-auto ui-group-page">
    <div class="flex-col ui-group-page-side ui-group-page-tree-group">
      <div class="subtitle">
        <div class="subtitle-wrapper" v-if="metaNode">
          <h4>
            {{ metaNode.name }}
          </h4>
          <span @click="goAddLevelOne" class="add">
            <XIcon name="add" size="14px" class="icon" />
            新{{ nodeTypeName }}
          </span>
        </div>
      </div>
      <GroupTree
        v-if="tree"
        v-show="tree.children.length !== 0"
        :data="tree"
        :showUser="false"
        :showHeadCount="true"
        @node-change="onNodeChange"
        ref="tree"
        class="tree"
      />
      <div v-if="tree && tree.children.length === 0" class="tree-no-data">
        <XIcon name="nogroup" class="tree-no-data-icon" />
        <span class="tree-no-data-info">您还未创建任何{{ nodeTypeName }}</span>
        <span class="tree-no-data-help">点击“+新{{ nodeTypeName }}”按钮，创建您的第一个{{ nodeTypeName }}</span>
      </div>
      <div v-if="loading" style="margin: auto;">
        <Spin large></Spin>
      </div>
    </div>
    <div class="ui-group-page-detail flex-col flex-auto" style="width: 0;">
      <div v-if="loading" style="margin: auto;">
        <Spin large></Spin>
      </div>
      <template v-else-if="!loading && !curNode">
        <div class="node-detail-no-data">
          <XIcon name="noaccount" class="node-detail-no-data-icon"/>
          <span class="node-detail-no-data-info">暂时没有联系人账号</span>
        </div>
      </template>
      <template v-else>
        <div class="ui-group-page-detail-header flex-row">
          <h2 class="title">{{ curNode.name }}</h2>
          <Button @click="goEdit">编辑{{ nodeTypeName }}</Button>
          <Button @click="goAdd">添加下级{{ nodeTypeName }}</Button>
          <div class="flex-row flex-auto"></div>
          <router-link :to="{name: 'admin.group.perm', query: {groupId: curNode.id}}">
            <Button type="primary">分组权限管理</Button>
          </router-link>
        </div>
        <div class="ui-group-page-detail-content flex-col">
          <div class="group-list-block flex-col">
            <h4 class="subtitle">下级{{ nodeTypeName }}</h4>
            <ul class="flex-col flex-auto" v-if="curNode.children.length > 0">
              <li
                v-for="item in curNode.children"
                @click="$refs.tree.select(item.id);"
                class="flex-row"
              >
                <span>{{ item.name }}</span>
                <Icon type="ios-arrow-forward" color="#D8D8D8"></Icon>
              </li>
            </ul>
            <span v-else>没有下级{{ nodeTypeName }}</span>
          </div>
          <div class="user-list-block flex-col flex-auto">
            <h4 class="subtitle">{{ nodeTypeName }}成员</h4>
            <UserList
              :metaNode="metaNode"
              :node="curNode"
              :key="curNode.id"
              @on-update="refresh"
            />
          </div>
        </div>
      </template>
    </div>

    <Edit
      v-if="editData"
      v-bind="editData"
      ref="edit"
      @on-save="refresh"
      @on-hide="onEditHide"
    />
  </div>
  `,
})
export default class Group extends Vue {
  metaNodeId: string|null = null
  metaNode: Node|null = null
  tree: TreeNode|null = null
  curNode: Node|null = null

  editData: {
    metaNode: Node,
    node?: Node,
    parent?: Node,
  }|null = null

  @Watch('$route')
  onRouteChange(route) {
    this.metaNodeId = this.$route.query.id as string
  }

  @Watch('metaNodeId')
  onMetaNodeIdChange() {
    this.tree = null
    this.$nextTick(() => this.loadData())
  }

  get loading() {
    return !this.tree
  }

  get nodeTypeName() {
    return ['dept', 'role', 'label'].includes(this.metaNode!.nodeSubject)
      ? this.metaNode!.name
      : '分组'
  }

  async loadData() {
    const metaNode = await api.Node.retrieve(this.metaNodeId!)
    this.metaNode = metaNode
    await this.loadTreeData()
  }

  async refresh() {
    this.loadTreeData()
  }

  async loadTreeData() {
    const hierarchy = await api.Node.tree(this.metaNode!.id)
    const node = Node.fromData(hierarchy)

    const isSameTree = this.tree && this.tree.raw.id === node.id
    const expandIds = isSameTree
      ? this.tree!.flattenNodes().filter(i => i.expand).map(i => i.raw.id) as string[]
      : node.children.map(i => i.id)

    const selectedNode = isSameTree && this.curNode
      ? this.curNode
      : node.children[0]

    const options = {
      showUser: false,
      expandIds,
      selectedIds: selectedNode ? [selectedNode.id] : [],
    }
    const tree = TreeNode.fromNode(node, options)

    if (!selectedNode) {
      this.curNode = null
    }

    this.tree = null
    this.$nextTick(() => this.tree = tree)
  }

  onNodeChange(val: Node) {
    this.curNode = val
  }

  goAddLevelOne() {
    this.editData = {metaNode: this.metaNode!}
    this.$nextTick(() => this.$refs.edit.show())
  }

  goAdd() {
    this.editData = {metaNode: this.metaNode!, parent: this.curNode!}
    this.$nextTick(() => this.$refs.edit.show())
  }

  async goEdit() {
    const node = await api.Node.retrieve(this.curNode!.id)
    // TODO (kaishun): remove this
    node.parent = this.curNode!.parent

    this.editData = {metaNode: this.metaNode!, node}
    this.$nextTick(() => this.$refs.edit.show())
  }

  onEditHide() {
    // 用this.$nextTick, 则没有隐藏时的过渡效果
    setTimeout(() => this.editData = null, 500)
  }

  created() {
    this.metaNodeId = this.$route.query.id as string
  }
}

