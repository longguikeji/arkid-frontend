<template>
  <div class="list-component-container">
    <div class="list-optional-container">
      <TreePage
        v-if="state.treePage"
        :path="getChildPath('treePage')"
      />
      <TablePage
        v-if="state.tablePage"
        :path="getChildPath('tablePage')"
      />
    </div>
    <div class="list-selected-container">
      <Card :path="getChildPath('selected.header')">
        <List :path="getChildPath('selected.list')" />
      </Card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ListAssemblyState from './ListAssemblyState'
import TreePage from '@/admin/TreePage/index.vue'
import TablePage from '@/admin/TablePage/index.vue'
import Card from '@/admin/common/Card/index.vue'
import List from '@/admin/common/data/List/index.vue'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'ListAssembly',
  components: {
    TablePage,
    TreePage,
    Card,
    List
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
  display: flex;
  .list-optional-container {
    width: 50%;
    ::v-deep .tree__page__container {
      width: 100%;
      height: auto;
      .tree__card {
        width: 100%;
        height: auto;
      }
    }
  }
  .list-selected-container {
    width: 50%;
    height: auto;
    padding-left: 5%;
    ul {
      list-style: none;
    }
  }
}
</style>
