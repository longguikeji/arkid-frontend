import {Node, TreeNode} from '@/models/oneid'
import GroupTree from '@/oneid-app/comps/GroupTree'
import * as api from '@/services/oneid'
import { cloneDeep } from 'lodash'
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
            <h4 class="subtitle">
              下级{{ nodeTypeName }}
              <div v-if="curNode.children && curNode.children.length > 1">
                <div v-if="isNodeSortable">
                  <Button class="node-sort-btn" @click="toCancelNodeSort">取消</Button>
                  <Button class="node-sort-btn" type="primary" @click="toConfirmNodeSort">确认排序</Button>
                </div>
                <div v-else>
                  <Button class="node-sort-btn" @click="toNodeSort">调整排序</Button>
                </div>
              </div>
            </h4>
            <ul class="flex-col flex-auto" v-if="curNode.children.length > 0">
              <li
                v-for="(item, index) in curNode.children"
                class="flex-row"
              >
                <div class="node-sort-icon" v-if="isNodeSortable && curNode.children.length > 1">
                  <Icon v-if="index !== 0" type="md-arrow-round-up" color="#D8D8D8" @click="toNodeSortUp(index)"></Icon>
                  <Icon v-if="index !== curNode.children.length-1" type="md-arrow-round-down" color="#D8D8D8" @click="toNodeSortDown(index)"></Icon>
                </div>
                <span class="cur-node-children-name" @click="$refs.tree.select(item.id)">{{ item.name }}</span>
                <Icon class="cur-node-children-select-icon" type="ios-arrow-forward" color="#D8D8D8" @click="$refs.tree.select(item.id)"></Icon>
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

  get loading() {
    return !this.tree
  }

  get nodeTypeName() {
    return ['dept', 'role', 'label'].includes(this.metaNode!.nodeSubject)
      ? this.metaNode!.name
      : '分组'
  }

  isNodeSortable: boolean = false

  isNodeSorted: boolean = false

  curNodeChildren: Node[] | undefined = undefined

  metaNodeId: string|null = null
  metaNode: Node|null = null
  tree: TreeNode|null = null
  curNode: Node|null = null

  editData: {
    metaNode: Node,
    node?: Node,
    parent?: Node,
  }|null = null

  treeOptions = {}

  @Watch('$route')
  onRouteChange(route) {
    this.metaNodeId = this.$route.query.id as string
  }

  @Watch('metaNodeId')
  onMetaNodeIdChange() {
    this.tree = null
    this.$nextTick(() => this.loadData())
  }

  @Watch('curNode.name')
  onCurNodeChange() {
    this.isNodeSortable = false
  }

  toNodeSort() {
    this.isNodeSortable = true
    this.curNodeChildren = cloneDeep(this.curNode!.children)
  }

  toCancelNodeSort() {
    this.isNodeSortable = false
    if (this.isNodeSorted) {
      this.curNode!.children = this.curNodeChildren!
    }
  }

  toNodeSortUp(index: number) {
    const children = this.curNode!.children
    const len = children.length || 0
    if (len > 0 && index !== 0) {
      this.isNodeSorted = true
      const data = [ children[index], children[index - 1] ]
      this.$set(children, index, data[1])
      this.$set(children, index-1, data[0])
    }
  }

  toNodeSortDown(index: number) {
    const children = this.curNode!.children
    const len = children.length || 0
    if (len && index !== len-1) {
      this.isNodeSorted = true
      const data = [ children[index], children[index + 1] ]
      this.$set(children, index, data[1])
      this.$set(children, index+1, data[0])
    }
  }

  async toConfirmNodeSort() {
    const { dept_id: id, children } = this.curNode!
    const deptIds = children.map(c => c.dept_id) || []
    this.isNodeSortable = false
    await api.Node.sortTree(id, deptIds)
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

    const defaultSelectedNode = node.children.length === 1 ? node.children[0] : null

    const options = {
      showUser: false,
      expandIds,
      selectedIds: selectedNode ? [selectedNode.id] : [],
    }

    if (defaultSelectedNode) {
      options.selectedIds.push(defaultSelectedNode.id)
    }

    this.treeOptions = options

    const tree = TreeNode.fromNode(node, options)

    if (!selectedNode) {
      this.curNode = null
    }

    this.tree = null
    this.$nextTick(() => this.tree = tree)
  }

  async onNodeChange(val: Node, treeNode: TreeNode) {
    const hierarchy = await api.Node.tree(val.id)
    const nodes = Node.fromData(hierarchy)
    const children = nodes.children
    val.children = []
    treeNode.children = []
    const options = {
      parent: treeNode,
      ...this.treeOptions,
    }
    for(const child of children){
      val.children.push( child )
      treeNode.children.push( TreeNode.fromNode(child, options) )
    }
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

