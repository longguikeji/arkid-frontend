<template>
  <el-pagination
    :small="state.small || false"
    :background="state.background"
    :page-size="state.pageSize"
    :total="state.total"
    :page-count="state.pageCount"
    :current-page="state.currentPage"
    :layout="initLayout"
    :page-sizes="state.pageSizes"
    :popper-class="state.popperClass"
    :prev-text="state.prevText"
    :next-text="state.nextText"
    :disabled="state.disabled"
    @size-change="handleSizeChange"
    @current-change="actionHandler"
    @prev-click="actionHandler"
    @next-click="actionHandler"
  />
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import PaginationState from './PaginationState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'Pagination',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state():PaginationState {
    return super.$state as PaginationState
  }

  get initLayout() {
    if (this.state.layout) {
      return this.state.layout
    } else {
      return 'sizes, prev, pager, next, jumper, ->, total'
    }
  }

  private async handleSizeChange(pageSize: number) {
    this.state.pageSize = pageSize
    await this.runAction(this.state.action)
  }

  private async actionHandler(currentPage: number) {
    this.state.currentPage = currentPage
    await this.runAction(this.state.action)
  }
}
</script>
