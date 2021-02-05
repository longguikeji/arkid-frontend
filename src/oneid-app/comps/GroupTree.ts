import * as model from '@/models/oneid'
import {findTreeNode, findTreePath} from '@/utils'
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import './GroupTree.less'

/* tslint:disable: max-classes-per-file*/
@Component({
  template: html`
  <div class="ui-group-tree-component">
    <Input
      v-model="keyword"
      search
      clearable
      @on-change="doSearch"
      placeholder="搜索"
      class="search"
    />
    <ul
      class="search-result-list"
      v-if="keyword"
    >
      <li v-for="item in searchResults">
        <Checkbox
          :disabled="item.disableCheckbox"
          v-model="item.checked"
          @on-change="(val) => doCheckChange(item, val)"
        >
          <XIcon class= "checkitem" name="folder-green"/>
          <span>{{ item.title }}</span>
        </Checkbox>
      </li>
    </ul>

    <Breadcrumb class="breadcrumb" v-if="showPath && !keyword">
      <BreadcrumbItem
        v-for="item in path"
        @click.native="select(item.raw.id)">
        {{ item.raw.name }}
      </BreadcrumbItem>
    </Breadcrumb>
    <div class="ui-group-tree-wrapper">
      <Tree
        v-if="data"
        v-show="!keyword"
        ref="tree"
        :data="tree.children"
        :multiple="!!multiple"
        :showCheckbox="!!multiple"
        :checkStrictly="true"
        :render="renderItem"
        @on-check-change="onCheckChange"
        class="ui-group-tree"
      />
    </div>
  </div>
  `,
})
export default class GroupTree extends Vue {
  @Prop({type: model.TreeNode, required: true}) data!: model.TreeNode
  @Prop({type: Boolean, default: false}) showPath!: boolean
  @Prop({type: Boolean, default: true}) showIcon!: boolean
  @Prop({type: Boolean, default: false}) multiple!: boolean
  @Prop({type: Boolean, default: false}) showHeadCount!: boolean

  tree: model.TreeNode|null = null
  curNode: model.TreeNode|null = null
  checkedNodes: model.TreeNode[] = []

  keyword = ''
  searchResults: model.TreeNode[] = []

  @Watch('curNode')
  onCurNodeChange(val: model.TreeNode) {
    this.$emit('node-change', val.raw)
  }

  doSearch() {
    const nodes = this.flattenNodes
    this.searchResults = nodes
      .filter((node: model.TreeNode) => node.title.includes(this.keyword))
  }

  doCheckChange(cur: model.TreeNode, val: boolean) {
    this.$emit('on-check-change', [], cur)
  }

  get flattenNodes(): model.TreeNode[] {
    const results: model.TreeNode[] = []
    return results.concat(...this.tree!.children.map(n => n.flattenNodes()))
  }

  get path() {
    const {curNode} = this
    if (!curNode) {
      return [this.tree]
    }
    const path = this.getPath(curNode)
    const result = path
      .filter(i => i.type === 'node')
      .filter(i => i.raw.name !== 'root')
    return result
  }

  renderItem(h: Vue.CreateElement, {node}) {
    const {curNode} = this
    const {node: {raw, type, title}, nodeKey} = node

    const isCurrent = curNode && curNode.nodeKey === nodeKey

    return h(TreeItem, {
      props: {
        active: isCurrent,
        icon: this.showIcon ? this.getIcon(node.node) : '',
        title,
      },
      nativeOn: {
        click: () => {
          if (isCurrent) {
            return
          }
          this.select(node.node.raw.id)
        },
      },
    })
  }

  select(id: number) {
    this.flattenNodes.forEach(n => n.selected = false)
    this.toggleSelect(id, true)
  }

  unSelect(id: number) {
    this.toggleSelect(id, false)
  }

  toggleSelect(id: number, positive: boolean) {
    const curNode = findTreeNode(this.tree.children, n => n.raw.id === id)
    if (curNode) {
      curNode.selected = positive
      this.curNode = curNode
      this.$nextTick(() => {
        this.onSelectChange(this.$refs.tree.getSelectedNodes(), curNode)
      })
    }
  }

  unCheck(id: number) {
    const node = this.flattenNodes.find(n => n.raw.id === id)!
    node.checked = false
    this.$forceUpdate()
  }

  onCheckChange(array: model.TreeNode[], cur: model.TreeNode) {
    this.$emit('on-check-change', array, cur)
  }

  onSelectChange(array: model.TreeNode[], cur: model.TreeNode) {
    this.$emit('on-select-change', array, cur)
  }

  getPath(node: model.TreeNode) {
    return findTreePath(this.tree, (n: model.TreeNode) => {
      if (n.raw.id === node.raw.id) {
        if (!n.parent) {
          return true
        } else if (n.parent.raw.id === node.parent!.raw.id) {
          return true
        }
      }
      return false
    })
  }

  getIcon(node: model.TreeNode): string {
    return node.type === 'node' ? 'folder-green'
      : node.type === 'user' ? 'icon-accout'
      : ''
  }

  onMountedOrUpdated() {
    const [node] = this.$refs.tree.getSelectedNodes()
    if (node) {
      // iview tree 使用 render 函数自定义节点渲染内容时，select事件不会被触发
      this.select(node.raw.id)
    }
  }

  created() {
    this.tree = this.data
  }

  mounted() {
    this.onMountedOrUpdated()
  }

  updated() {
    this.onMountedOrUpdated()
  }
}

@Component({
  template: html`
  <div :class="'ui-tree-item' + (disabled ? ' disabled' : '') + (active ? ' active' : '')">
    <div class="ui-tree-item-bg"></div>
    <XIcon :name="icon" />
    <span class="ui-tree-item-title"><span>{{ title }}</span></span>
  </div>
  `,
})
class TreeItem extends Vue {
  @Prop(Boolean) readonly disabled?: boolean
  @Prop(Boolean) readonly active?: boolean
  @Prop(String) readonly icon!: string
  @Prop(String) readonly title!: string
}