<template>
  <div class="list-component-container">
    <TreePage
      v-if="state.treePage.tree"
      :path="getChildPath('treePage')"
    />
    <TablePage
      v-if="state.tablePage.table"
      :path="getChildPath('tablePage')"
    />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ListAssemblyState from './ListAssemblyState'
import TreePage from '@/admin/TreePage/index.vue'
import TablePage from '@/admin/TablePage/index.vue'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'ListAssembly',
  components: {
    TablePage,
    TreePage
  }
})
export default class extends Mixins(BaseVue) {
  get state(): ListAssemblyState {
    return this.$state as ListAssemblyState
  }
}
</script>

<style lang="scss" scoped>
.list-component-container {
  width: 100%;
}
</style>
