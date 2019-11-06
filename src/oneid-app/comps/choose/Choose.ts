import {Node, TreeNode, User} from '@/models/oneid'
import GroupTree from '@/oneid-app/comps/GroupTree'
import * as api from '@/services/oneid'
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import './Choose.less'
import Selection from './Selection'
import UserList from './UserList'

@Component({
  components: {
    GroupTree,
    UserList,
    Selection,
  },
  template: html`
  <Modal
    v-model="showModal"
    :title="title"
    className="ui-choose-base"
    :width="metaNode ? 800 : 1000"
  >
    <div class="ui-choose-base--wrapper">
      <div class="ui-choose-base--left" v-if="!metaNode && !onlyUser">
        <h3 class="title">分组类型</h3>
        <ul class="base-list">
          <li
            @click="activeMetaNode = null"
            :class="activeMetaNode === null ? 'active' : ''"
          ><span>账号</span></li>
          <li
            v-for="item in metaNodeList"
            :key="item.id"
            :class="activeMetaNode && activeMetaNode.id === item.id ? 'active' : ''"
            @click="activeMetaNode = item"
          >
            <span>{{ item.name }}</span>
          </li>
        </ul>
      </div>
      <div class="ui-choose-base--middle" v-if="!activeMetaNode">
        <h3 class="title">选择</h3>
        <UserList
          :userSelection="userSelection"
          @on-check-change="onUserListCheckChange"
        />
      </div>
      <div class="ui-choose-base--middle" v-if="activeMetaNode">
        <h3 class="title">选择</h3>
        <GroupTree
          v-if="tree"
          v-show="!keyword"
          :data="tree"
          :showPath="true"
          :showIcon="showIcon"
          :multiple="multiple"
          :showUser="showUser"
          :clearable="false"
          @on-check-change="onTreeCheckChange"
          @on-select-change="onTreeSelectChange"
          ref="tree"
          class="tree"
        />
      </div>
      <div class="ui-choose-base--right">
        <h3 class="title">已选</h3>
        <Selection
          ref="selection"
          :nodeSelection="nodeSelection"
          :userSelection="userSelection"
          @on-remove-node="onSelectionRemoveNode"
          @on-remove-user="onSelectionRemoveUser"
        />
      </div>
    </div>
    <div slot="footer" class="ui-choose-base--footer flex-row">
      <div>
        <Button type="default" @click="onCancel">取消</Button>
        <Button type="primary" @click="onOk">保存</Button>
      </div>
    </div>
  </Modal>
  `,
})
export default class Choose extends Vue {
  @Prop({type: Node}) metaNode?: Node
  @Prop({type: String, required: true, default: ''}) title!: string
  @Prop({type: Boolean, default: false}) showUser!: boolean
  @Prop({type: Boolean, default: false}) multiple!: boolean
  @Prop({type: Boolean, default: true}) showIcon!: boolean
  @Prop({type: Array, default: () => []}) checkedIds!: string[]
  @Prop({type: Array, default: () => []}) selectedIds!: string[]
  @Prop({type: Array, default: () => []}) checkedUserIds!: string[]
  @Prop({type: Array, default: () => []}) selectedUserIds!: string[]
  @Prop({type: Array, default: () => []}) disabledIds!: string[]
  @Prop({type: Boolean, default: false}) onlyUser!: boolean

  showModal = false

  activeMetaNode: Node|null = null
  metaNodeList: Node[] = []

  tree: TreeNode|null = null

  nodeSelection: Node[] = []
  userSelection: User[] = []

  onUserListCheckChange(array: User[], cur: User) {
    this.userSelection = cur.checked
      ? [...this.userSelection, cur]
      : this.userSelection.filter(user => user.id !== cur.id)
  }

  onTreeCheckChange(array: TreeNode[], cur: TreeNode) {
    if (this.multiple) {
      if (cur.type === 'node') {
        this.nodeSelection = cur.checked
          ? [...this.nodeSelection, cur.raw] as Node[]
          : this.nodeSelection.filter(node => node.id !== cur.raw.id)
      } else {
        this.userSelection = cur.checked
          ? [...this.userSelection, cur.raw] as User[]
          : this.userSelection.filter(user => user.id !== cur.raw.id)
      }
    }
  }

  onTreeSelectChange(array: TreeNode[], cur: TreeNode) {
    if (!this.multiple) {
      if (cur.type === 'node') {
        this.nodeSelection = [cur.raw!] as Node[]
      } else {
        this.userSelection = [cur.raw!] as User[]
      }
    }
  }

  getSelectionIcon(type: string): string {
    return ''
  }

  onSelectionRemoveNode(node: Node) {
    this.nodeSelection = this.nodeSelection.filter(n => n.id !== node.id)
    this.$nextTick(() => this.unCheckOrUnSelectTreeNode(node.id))
  }
  onSelectionRemoveUser(user: User) {
    this.userSelection = this.userSelection.filter(u => u.id !== user.id)
    this.$nextTick(() => this.unCheckOrUnSelectTreeNode(user.id))
  }

  unCheckOrUnSelectTreeNode(id: string) {
    if (this.$refs.tree) {
      if (this.multiple) {
        this.$refs.tree.unCheck(id)
      } else {
        this.$refs.tree.unSelect(id)
      }
    }
  }

  async onOk() {
    this.$emit(
      'on-ok',
      this.nodeSelection,
      this.userSelection,
    )
    this.showModal = false
  }

  onCancel() {
    this.showModal = false
  }

  async show() {
    await this.loadSelection()
    if (this.activeMetaNode) {
      await this.loadTreeData()
    } else {
      this.loadMetaNodeList()
    }
    this.$nextTick(() => {
      this.showModal = true
    })
  }

  @Watch('activeMetaNode')
  async onMetaNodeChange(activeMetaNode: Node) {
    await this.loadSelection()
    if (activeMetaNode) {
      this.tree = null
      await this.loadTreeData()
    }
  }

  async loadMetaNodeList() {
    const [defaultMetaNode, customMetaNode] = await api.Node.metaNode()
    this.metaNodeList = [...defaultMetaNode.children, ...customMetaNode.children]
  }

  async loadTreeData() {
    const hierachy = await api.Node.tree(this.activeMetaNode!.id)
    // TODO (kaishun): node, user 两者的 id 可能重复， 需处理
    const selectionIds = [
      ...this.nodeSelection.map(n => n.id),
      ...this.userSelection.map(u => u.id),
    ]
    const options = {
      showUser: this.showUser,
      checkedIds: selectionIds,
      selectedIds: selectionIds,
      disabledIds: this.disabledIds,
    }
    this.tree = TreeNode.fromNode(Node.fromData(hierachy), options)
  }

  async loadSelection() {
    const nodes: Node[] = this.multiple
      ? await api.Node.listFromIds(this.checkedIds)
      : await api.Node.listFromIds(this.selectedIds)

    const users: User[] = this.multiple
      ? await api.User.listFromIds(this.checkedUserIds)
      : await api.User.listFromIds(this.selectedUserIds)

    this.nodeSelection = nodes
    this.userSelection = users
  }

  created() {
    if (this.metaNode) {
      this.activeMetaNode = this.metaNode
    }
  }

  updated() {
    if (this.metaNode) {
      this.activeMetaNode = this.metaNode
    }
  }
}
