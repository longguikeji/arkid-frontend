<template>
  <el-table
    ref="elementTable"
    :key="state.key"
    :data="tableData"
    :height="'70vh'"
    :stripe="state.stripe || true"
    :border="state.border"
    :size="state.size"
    :fit="state.fit"
    :show-header="state.showHeader"
    :highlight-current-row="state.highlightCurrentRow || true"
    @select="handleSelectionChange"
    @row-click="handleRowClick"
    @select-all="handleAllSelectionChange"
  >
    <el-table-column
      v-if="state.selection && state.selection.exist === true"
      type="selection"
      :width="state.selection.width || '50'"
    />
    <el-table-column
      v-if="state.index && state.index.exist === true"
      type="index"
      :width="state.index.width || '30'"
      label="#"
    />
    <TableColumn
      v-for="(child, index) in state.columns"
      :key="index"
      :data="tableData"
      :path="getChildPath('columns[' + index + ']')"
    />
  </el-table>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import TableState from './TableState'
import TableColumn from './TableColumn/index.vue'
import BaseVue, { FlowState } from '@/admin/base/BaseVue'

@Component({
  name: 'Table',
  components: {
    TableColumn
  }
})
export default class extends Mixins(BaseVue) {
  get state(): TableState {
    return this.$state as TableState
  }

  get tableData() {
    return this.state.data
  }

  handleSelectionChange(val: any, row: any) {
    this.executeSelectionAction(row, true)
  }

  handleAllSelectionChange(val) {
    this.executeSelectionAction(val, false)
  }

  handleRowClick(val) {
    this.executeSelectionAction(val, true)
    if (this.state.selection?.exist) {
      const values = this.state.selection.values
      let index = -1
      for (let i = 0; i < values.length; i++) {
        if (values[i].uuid === val.uuid) {
          index = i
          break
        }
      }
      const multipleTable: any = this.$refs.elementTable
      if (index === -1) {
        this.state.selection.values.push(val)
        multipleTable.toggleRowSelection(val, true)
      } else {
        this.state.selection.values.splice(index, 1)
        multipleTable.toggleRowSelection(val, false)
      }
    }
  }

  executeSelectionAction(val, isSingle) {
    if (this.state.selectAction) {
      this.state.selectAction.forEach((iaction: FlowState) => {
        if (iaction.params) {
          iaction.params = {
            ...iaction.params,
            data: val,
            isSingle: isSingle
          }
        }
      })
      this.runAction(this.state.selectAction)
    }
  }
}
</script>
