import {Node} from '@/models/oneid'
import * as api from '@/services/oneid'
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import './Meta.less'

@Component({
  template: html`
  <div class="flex-row flex-auto ui-group-meta-page">
    <div class="flex-col ui-group-meta-page-side ui-group-meta-page-base-group">
      <div class="meta-node-title default-title">
        <XIcon name="folder-green" size="14px" class="icon" />
        默认分组类型
      </div>
      <ul class="default-list" v-if="defaultMetaNode">
        <li v-for="item in defaultMetaNode.children"
          :key="item.id"
          :class="item.id === curMetaNode.id ? 'active' : ''"
          @click="onMetaNodeClick(item)"
        >
          <span>{{ item.name }}</span>
        </li>
      </ul>
      <div class="meta-node-title custom-title">
        <span>
          <XIcon name="custom-classification" size="14px" class="icon" />
          <span>自定义分组类型</span>
        </span>
        <span @click="doStartAddCustomNode" class="add">
          <XIcon name="add" size="14px" class="icon" />
          新分组类型
        </span>
      </div>
      <ul class="custom-list" v-if="customMetaNode">
        <li v-for="item in customMetaNode.children"
          :key="item.id"
          :class="item.id === curMetaNode.id ? 'active' : ''"
          @click="onMetaNodeClick(item)"
        >
          <Input
            v-if="operatingCustomNode && operatingCustomNode.id === item.id"
            autofocus
            clearable
            :value="operatingCustomNode.name"
            @on-enter="doRenameCustomNode"
            @on-blur="operatingCustomNode = null"
          />
          <template v-else>
            <span>{{ item.name || '未命名' }}</span>
            <Dropdown trigger="click">
              <Icon type="ios-more" color="white" size="18" class="icon-more"></Icon>
              <DropdownMenu slot="list">
                <DropdownItem @click.native="() => doStartRenameCustomNode(item)">重命名</DropdownItem>
                <DropdownItem @click.native="() => doRemoveCustomNode(item)">删除</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </template>
        </li>
      </ul>
      <div
        v-if="isAddingCustomNode"
        class="search-input"
      >
        <Input
          v-model="customNodeName"
          type="text"
          @on-enter="doAddCustomNode"
          placeholder="输入名称"
          :clearable="false"
          autofocus
        >
          <XIcon
            name="search-cancel"
            slot="suffix"
            :md="true"
            :style="{display: customNodeName ? '' : 'none'}"
            @click="customNodeName = null"
          />
        </Input>
        <div>
          <span @click="isAddingCustomNode = false">取消</span>
          <span @click="doAddCustomNode">确认</span>
        </div>
      </div>
      <span v-if="customMetaNode && customMetaNode.children.length === 0">
        暂无自定义分组类型
      </span>
    </div>
    <router-view></router-view>
  </div>
  `,
})
export default class Meta extends Vue {
  defaultMetaNode: Node|null = null
  customMetaNode: Node|null = null
  isAddingCustomNode = false
  operatingCustomNode: Node|null = null

  curMetaNode: Node|null = null

  customNodeName = null

  @Watch('curMetaNode')
  onCurMetaNodeChange(val: Node) {
    this.$router.replace({
      name: 'admin.group.node',
      query: {id: val.id},
    })
  }

  async loadData() {
    const [defaultMetaNode, customMetaNode] = await api.Node.metaNode()

    this.defaultMetaNode = defaultMetaNode
    this.customMetaNode = customMetaNode

    if (!this.curMetaNode) {
      this.curMetaNode = defaultMetaNode.children[0]
    }
  }

  onMetaNodeClick(item: Node) {
    this.curMetaNode = item
  }

  doStartAddCustomNode() {
    this.operatingCustomNode = null
    this.isAddingCustomNode = true
  }

  async doAddCustomNode(event: Event) {
    const name = this.customNodeName
    if (!name) {
      this.isAddingCustomNode = false
      return
    }
    const customRoot = new Node()
    customRoot.name = this.customMetaNode!.name
    customRoot.id = this.customMetaNode!.id

    const node = new Node()
    node.name = name
    node.parent = customRoot

    this.$Loading.start()
    try {
      await api.Node.create(node)
      this.$Loading.finish()
      this.isAddingCustomNode = false
      this.customNodeName = null
      this.loadData()
    } catch(e) {
      this.$Loading.error()
    }
  }

  async doStartRenameCustomNode(item: Node) {
    this.isAddingCustomNode = false
    this.operatingCustomNode = item
  }

  async doRenameCustomNode(event: Event) {
    const name = event.target!.value
    if (!name) {
      this.operatingCustomNode = null
      return
    }
    const node = new Node()
    node.name = name
    node.id = this.operatingCustomNode!.id

    this.$Loading.start()
    try {
      await api.Node.partialUpdate(node)
      this.$Loading.finish()
      this.operatingCustomNode = null
      this.loadData()
    } catch(e) {
      this.$Loading.error()
    }
  }

  async doRemoveCustomNode(item: Node) {
    this.$Loading.start()
    try {
      await api.Node.remove(item.id)
      this.$Loading.finish()
      this.loadData()
    } catch(e) {
      if (e.status === 400 && e.data.node) {
        if (e.data.node.includes('protected_by_child_node')) {
          this.$Message.error('删除失败：存在依赖的节点')
          return
        }
        if (e.data.node.includes('protected_by_child_user')) {
          this.$Message.error('删除失败：存在依赖的账号')
          return
        }
      }
      this.$Loading.error()
    }
  }

  updated() {
    if (
      // tslint:disable-next-line:prefer-switch
      this.$route.name === 'admin.group' ||
      this.$route.name === 'admin.group.node'
    ) {
      if (this.curMetaNode && !this.$route.query.id) {
        this.curMetaNode = this.defaultMetaNode!.children[0]
      }
    }
  }

  async mounted() {
    this.loadData()
  }
}
