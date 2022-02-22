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
            v-if="!state.getSlotVisible || state.getSlotVisible(data)"
            class="custom-tree-node-other"
          >
            <AdminComponent
              v-for="(item, index) in state.slot"
              :key="index"
              :path="getTreeNodeSlotPath(item, data)"
            />
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

  private filterText = ''

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

  async handleNodeClick(data: TreeNodeProps) {
    this.state.node = data
    if (this.state.action) {
      await this.runAction(this.state.action)
    }
    if (this.state.nodeClickAction) {
      await this.runAction(this.state.nodeClickAction)
    }
  }

  getTreeNodeSlotPath(item: any, node: TreeNodeProps) {
    if (!this.state.slotState) {
      this.state.slotState = {}
    }
    const uuid = node.uuid
    if (uuid) {
      this.state.slotState[uuid] = {
        type: item.type,
        state: item.state.map((n) => {
          return {
            ...n,
            data: node
          }
        })
      }
      return this.getChildPath(`slotState.${uuid}`)
    } else {
      return this.getChildPath('slot')
    }
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
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
