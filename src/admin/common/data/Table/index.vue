<template>
  <el-table
    ref="arkidTable"
    :row-key="rowKeyFunc"
    :data="state.data"
    :height="'70vh'"
    :stripe="state.stripe"
    :border="state.border"
    :size="state.size"
    fit
    :show-header="state.showHeader"
    :highlight-current-row="state.highlightCurrentRow"
    @select="handleSingleSelectionChange"
    @row-click="handleRowClick"
    @select-all="handleAllSelectionChange"
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
      v-if="state.index || true"
      type="index"
      :width="state.indexWidth || '60'"
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
  </el-table>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
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

  get default() {
    return this.state.selection?.default
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

<style lang="scss" scoped>
.table-expand label {
  width: 90px;
  color: #99a9bf;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
