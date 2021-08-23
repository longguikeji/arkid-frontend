<template>
  <el-table
    ref="arkidTable"
    :row-key="rowKeyFunc"
    :data="tableData"
    :height="'70vh'"
    :stripe="state.stripe || true"
    :border="state.border"
    :size="state.size"
    :fit="state.fit"
    :show-header="state.showHeader"
    :highlight-current-row="state.highlightCurrentRow || true"
    @select="handleSingleSelectionChange"
    @row-click="handleRowClick"
    @select-all="handleAllSelectionChange"
  >
    <el-table-column
      v-if="state.selection"
      type="selection"
      :width="state.selection.width || '50'"
    />
    <el-table-column
      v-if="state.index"
      type="index"
      :width="state.indexWidth || '30'"
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
import BaseVue from '@/admin/base/BaseVue'
import Sortable from 'sortablejs'

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

  get default() {
    return this.state.selection?.default
  }

  // @Watch('tableData')
  // onTableDataChange() {
  //   this.initTableSelection()
  // }

  // @Watch('default')
  // onTableSelectionDefaultChange() {
  //   this.initTableSelection()
  // }

  mounted() {
    if (this.state.sortable) {
      this.initRowSort()
    }
  }

  initRowSort() {
    const tbody: any = document.querySelector('.el-table__body-wrapper tbody')
    const _this: any = this
    Sortable.create(tbody, {
      onEnd({ newIndex, oldIndex }) {
        const currRow = _this.tableData.splice(oldIndex, 1)[0]
        _this.tableData.splice(newIndex, 0, currRow)
        _this.runAction(_this.state.sortAction)
      }
    })
  }

  rowKeyFunc(row) {
    if (row.uuid) {
      return row.uuid
    }
  }

  // initTableSelection() {
  //   if (this.state.selection) {
  //     this.$nextTick(() => {
  //       const defaults = this.state.selection!.default
  //       this.tableData?.forEach(row => {
  //         if (row.uuid) {
  //           if (defaults?.includes(row.uuid)) {
  //             (this.$refs.arkidTable as any).toggleRowSelection(row, true)
  //             this.dealSelectionValue(row)
  //           } else {
  //             (this.$refs.arkidTable as any).clearSelection()
  //           }
  //         }
  //       })
  //     })
  //   }
  // }

  handleRowClick(row, column, event) {
    this.state.row = row
    this.runAction(this.state.rowClickAction)
  }

  handleSingleSelectionChange(selection, row) {
    this.dealSelectionValue(row)
    this.runAction(this.state.selection!.action)
  }

  handleAllSelectionChange(selection) {
    this.dealAllSelectionValue(selection)
    this.runAction(this.state.selection!.action)
  }

  dealSelectionValue(value) {
    const values = this.state.selection!.values
    const defaults = this.state.selection!.default
    const ids = values.map(item => item.uuid)
    if (ids.includes(value.uuid)) {
      for (let i = 0, len = values.length; i < len; i++) {
        values.splice(i, 1)
        break
      }
    } else {
      values.push(value)
    }
    if (!defaults!.includes(value.uuid)) {
      defaults?.push(value.uuid)
    }
  }

  dealAllSelectionValue(value) {
    let values = this.state.selection!.values
    if (values?.length) {
      values.length = 0
    } else {
      values = value
    }
  }
}
</script>
