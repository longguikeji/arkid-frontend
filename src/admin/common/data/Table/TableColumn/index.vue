<template>
  <el-table-column
    v-if="state.hidden !== true"
    :index="state.index"
    :column-key="state.columnKey"
    :label="state.label"
    :prop="state.prop"
    :width="state.width"
    :fixed="state.fixed"
    :align="state.align || 'center'"
    :show-overflow-tooltip="state.showOverflowTooltip"
  >
    <template v-if="state.children">
      <TableColumn
        v-for="(child, index) in state.children"
        :key="index"
        :path="getChildPath('children[' + index + ']')"
      />
    </template>
    <template slot-scope="scope">
      <AdminComponent
        v-if="state.scope"
        :key="tableColumnScopeKey"
        :path="getAdminScopePath(scope)"
      />
      <template v-else>
        <span>{{ scope.row[state.prop] }}</span>
      </template>
    </template>
  </el-table-column>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator'
import TableColumnState from './TableColumnState'
import AdminComponent from '@/admin/common/AdminComponent/index.vue'
import BaseVue from '@/admin/base/BaseVue'
import { isArray } from 'lodash'

@Component({
  name: 'TableColumn',
  components: {
    AdminComponent
  }
})
export default class extends Mixins(BaseVue) {
  private tableColumnScopeKey = 'arkid-table-column-scope' + +new Date()

  @Watch('data')
  onDataChange() {
    this.tableColumnScopeKey = 'arkid-table-column-scope' + +new Date()
  }

  get state(): TableColumnState {
    return this.$state as TableColumnState
  }

  getAdminScopePath(scope) {
    if (!this.state.scopeColumn) this.state.scopeColumn = []
    const { state, type } = this.state.scope!
    const index = scope.$index; const row = scope.row
    if (isArray(state)) {
      this.state.scopeColumn[index] = {
        type,
        state: state.map(s => {
          return {
            data: row,
            ...s
          }
        })
      }
    } else {
      const prop = this.state.prop!
      this.state.scopeColumn[index] = {
        type,
        state: {
          ...state,
          value: row[prop]
        }
      }
    }
    return this.getChildPath(`scopeColumn[${index}]`)
  }
}
</script>
