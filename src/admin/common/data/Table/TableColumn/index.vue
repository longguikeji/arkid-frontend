<template>
  <el-table-column
    :index="state.index"
    :column-key="state.columnKey"
    :label="state.label"
    :prop="state.prop"
    :width="state.width"
  >
    <template v-if="state.children">
      <TableColumn
        v-for="(child, index) in state.children"
        :key="index"
        :path="getChildPath('children[' + index + ']')"
      />
    </template>
    <template slot-scope="scope">
      <template v-if="isScope">
        <template v-if="isOption">
          <span>{{ getOption(scope) }}</span>
        </template>
        <AdminComponent
          v-else
          :key="tableColumnScopeKey"
          :path="getScopePath(scope)"
        />
      </template>
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
import { isArray } from '@/utils/common'

@Component({
  name: 'TableColumn',
  components: {
    AdminComponent
  }
})
export default class extends Mixins(BaseVue) {
  @Prop({ required: true }) data!: Array<any>;

  private tableColumnScopeKey = 'arkid-table-column-scope' + +new Date()

  @Watch('data')
  onDataChange() {
    this.tableColumnScopeKey = 'arkid-table-column-scope' + +new Date()
  }

  get state(): TableColumnState {
    return this.$state as TableColumnState
  }

  get isScope() {
    return Boolean(this.state.scope)
  }

  get isOption() {
    return Boolean(this.state.scope?.type === 'Option')
  }

  getOption(scope) {
    const options = this.state.scope?.state.options
    const key = scope.row[this.state.prop!]

    let value = ''

    if (options instanceof Array) {
      if (key instanceof Array) {
        options.forEach(o => {
          key.forEach(v => {
            if (o.key === v) {
              value = value + '' + o.label
            }
          })
        })
      } else {
        options.forEach(o => {
          if (o.value === key) {
            value = o.label
          }
        })
      }
    }

    return value
  }

  getScopePath(scope: any) {
    const scopeRowState: Array<any> = []
    if (this.state.scope) {
      this.data.forEach((item, index) => {
        if (isArray(this.state.scope?.state)) {
          scopeRowState[index] = JSON.parse(JSON.stringify({
            state: this.state.scope?.state.map((e) => {
              return {
                data: item,
                ...e
              }
            }),
            type: this.state.scope?.type
          }))
        } else {
          scopeRowState[index] = JSON.parse(JSON.stringify({
            state: item[this.state.prop!] ? {
              value: item[this.state.prop!]
            } : this.state.scope?.state,
            type: this.state.scope?.type
          }))
        }
      })

      this.state.scopeRowState = scopeRowState
    }

    if (this.state.scopeRowState && this.state.scopeRowState.length > 0) {
      return this.getChildPath('scopeRowState[' + scope.$index + ']')
    } else {
      return this.getChildPath('scope')
    }
  }
}
</script>
