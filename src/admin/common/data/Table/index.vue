<template>
  <el-table
    ref="arkidTable"
    :row-key="rowKeyFunc"
    :data="state.data"
    :height="state.height"
    :stripe="state.stripe"
    :border="state.border"
    :size="state.size"
    fit
    :show-header="state.showHeader"
    :highlight-current-row="state.highlightCurrentRow"
    :cell-class-name="cellClassName"
    @row-click="handleRowClick"
    @cell-click="handleCellClick"
    @select="handleRowSelect"
    @select-all="handleSelectAll"
  >
    <el-table-column
      v-if="state.isExpand"
      type="expand"
      fixed="left"
      align="center"
    >
      <template slot-scope="scope">
        <el-form
          label-position="left"
          inline
          class="table-expand"
        >
          <el-form-item
            v-for="(value, key, index) in scope.row"
            :key="index"
            :label="state.columns[index].label || key"
          >
            {{ value }}
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      v-if="state.selection"
      type="selection"
      :width="state.selection.width || '50'"
      fixed="left"
      align="center"
    />
    <el-table-column
      v-if="state.index"
      type="index"
      :width="state.indexWidth"
      label="#"
      fixed="left"
      align="center"
    />
    <template v-if="state.columns.length">
      <TableColumn
        v-for="(child, index) in state.columns"
        :key="index"
        :path="getChildPath('columns[' + index + ']')"
      />
    </template>
    <template v-if="state.isDetail">
      <Dialog :path="getChildPath('detail')" />
    </template>
  </el-table>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import TableState, { SelectionState } from './TableState'
import TableColumn from './TableColumn/index.vue'
import Dialog from '@/admin/common/Dialog/index.vue'
import BaseVue from '@/admin/base/BaseVue'
import Sortable from 'sortablejs'

@Component({
  name: 'Table',
  components: {
    TableColumn,
    Dialog
  }
})
export default class extends Mixins(BaseVue) {
  private visible = false
  private detailPath = ''

  get state(): TableState {
    return this.$state as TableState
  }

  get default() {
    return this.state.selection?.default
  }

  @Watch('default')
  onDefaultValueChange() {
    this.initSelection()
  }

  mounted() {
    if (this.state.sortable) {
      this.initRowSort()
    }
  }

  initRowSort() {
    const tbody: any = document.querySelector('.el-table__body-wrapper tbody')
    const _this: any = this
    const { data, sortAction } = this.state
    if (!data) return
    Sortable.create(tbody, {
      onEnd({ newIndex, oldIndex }) {
        const currRow = data.splice(oldIndex as number, 1)[0]
        data.splice(newIndex as number, 0, currRow)
        _this.runAction(sortAction)
      }
    })
  }

  rowKeyFunc(row) {
    return row.uuid || row.id || row.username
  }

  cellClassName({ row, column, rowIndex, columnIndex }) {
    if (columnIndex === 0 || (column && column.type === 'index')) {
      return 'is-detail'
    } else {
      return ''
    }
  }

  handleRowClick(row, column, event) {
    this.state.row = row
    const action = this.state.rowClickAction
    if (action) {
      this.runAction(action)
    }
  }

  async handleCellClick(row, column) {
    this.state.row = row
    const action = this.state.detailAction
    if (action && column && column.type === 'index') {
      await this.runAction(action)
    }
  }

  initSelection() {
    if (this.default) {
      this.default.forEach(row => {
        (this.$refs.arkidTable as any).toggleRowSelection(row)
      })
    }
  }

  handleRowSelect(selection: any, row: any) {
    this.state.selection!.values = selection
  }

  handleSelectAll(selection: any) {
    this.state.selection!.values = selection
  }
}
</script>

<style lang="scss" scoped>
.table-expand label {
  width: 90px;
  color: #99a9bf;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
  padding-left: 20px;
}
::v-deep .el-table__row {
  .is-detail {
    color: #409eff;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
