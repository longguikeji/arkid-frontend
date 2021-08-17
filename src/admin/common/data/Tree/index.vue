<template>
  <div>
    <el-input
      v-if="state.isFilter"
      id="tree-content-filter-function"
      v-model="filterText"
      placeholder="输入关键字进行过滤"
    />
    <el-tree
      ref="tree"
      :data="state.data"
      :props="state.props"
      node-key="id"
      :render-after-expand="state.renderAfterExpand"
      :highlight-current="state.highlightCurrent"
      :default-expand-all="state.defaultExpandAll"
      :expand-on-click-node="state.expandOnClickNode"
      :check-on-click-node="state.checkOnClickNode"
      :auto-expand-parent="state.autoExpandParent"
      :default-expanded-keys="state.defaultExpandedKeys"
      :show-checkbox="state.showCheckbox"
      :check-strictly="state.checkStrictly"
      :default-checked-keys="state.defaultCheckedKeys"
      :current-node-key="state.currentNodeKey"
      :accordion="state.accordion"
      :indent="state.indent"
      :icon-class="state.iconClass"
      :draggable="state.draggable || true"
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      :filter-node-method="filterNode"
      @node-click="handleNodeClick"
    >
      <span
        slot-scope="{node, data}"
        class="custom-tree-node"
      >
        <span class="custom-tree-node-content">{{ node.label }}</span>
        <template v-if="state.slot">
          <span
            v-for="(item, index) in state.slot"
            :key="index"
            class="custom-tree-node-other"
          >
            <AdminComponent :path="getTreeNodeSlotPath(item, data)" />
          </span>
        </template>
      </span>
    </el-tree>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import TreeState from './TreeState'
import TreeNodeProps from './TreeNodeProps'
import BaseVue from '@/admin/base/BaseVue'
import AdminComponent from '@/admin/common/AdminComponent/index.vue'

@Component({
  name: 'Tree',
  components: {
    AdminComponent
  }
})
export default class extends Mixins(BaseVue) {
  get state(): TreeState {
    return this.$state as TreeState
  }

  private filterText = '';

  private nodeState = {}

  @Watch('filterText')
  private change(val: string) {
    const tree: any = this.$refs.tree
    tree.filter(val)
  }

  filterNode(value: any, data: any) {
    if (!value) return true
    return data.label.indexOf(value) !== -1
  }

  // 之后当tree列表进行拖拽时，需要用到此处内容
  allowDrop() {
    return true
  }

  allowDrag() {
    return true
  }

  handleNodeClick(data: TreeNodeProps) {
    this.state.node = data
    if (this.state.action) {
      this.runAction(this.state.action)
    }
    if (this.state.nodeClickAction) {
      this.runAction(this.state.nodeClickAction)
    }
  }

  getTreeNodeSlotPath(item: any, nodeData: TreeNodeProps) {
    this.state.slotState = {}
    if (this.state.data && nodeData.uuid && this.state.slotState) {
      this.setTreeNodeSlotStateData(this.state.data, nodeData)
      const currentNodeState = this.nodeState[nodeData.uuid]
      if (currentNodeState && currentNodeState.uuid) {
        if (item.state instanceof Array) {
          this.state.slotState[currentNodeState.uuid] = {
            type: item.type,
            state: item.state.map(istate => {
              return {
                ...istate,
                data: currentNodeState
              }
            })
          }
        } else {
          this.state.slotState[currentNodeState.uuid] = item
        }
      }
    }
    return this.getChildPath('slotState.' + nodeData.uuid + '')
  }

  setTreeNodeSlotStateData(treeData: Array<TreeNodeProps>, nodeData: TreeNodeProps) {
    treeData.forEach(treeItemData => {
      if (treeItemData.uuid && treeItemData.uuid === nodeData.uuid) {
        this.nodeState[treeItemData.uuid] = treeItemData
      } else if (treeItemData.children && treeItemData.children.length > 0) {
        this.setTreeNodeSlotStateData(treeItemData.children, nodeData)
      }
    })
  }
}
</script>

<style lang="scss" scoped>
#tree-content-filter-function {
  width: 90%;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
.custom-tree-node {
  position: relative;
}
.custom-tree-node-other {
  margin-left: 20px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
</style>
