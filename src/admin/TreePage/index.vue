<template>
  <div class="tree-page">
    <Card
      :class="[{'tree-page-main': !!state.list}]"
      :path="getChildPath('card')"
    >
      <Tree :path="getChildPath('tree')" />
      <Pagination
        v-if="state.pagination"
        :path="getChildPath('pagination')"
      />
      <template v-if="state.dialogs">
        <Dialog
          v-for="dialogName in Object.keys(state.dialogs)"
          :key="dialogName"
          :path="getChildPath('dialogs.' + dialogName)"
        />
      </template>
    </Card>
    <Card
      v-if="state.list"
      :path="getChildPath('list.header')"
      class="tree-page-list"
    >
      <List :path="getChildPath('list.data')" />
    </Card>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import Card from '@/admin/common/Card/index.vue'
import Tree from '@/admin/common/data/Tree/index.vue'
import Dialog from '@/admin/common/Others/Dialog/index.vue'
import TablePage from '@/admin/TablePage/index.vue'
import { TreePage } from './TreePageState'
import Pagination from '@/admin/common/data/Pagination/index.vue'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'TreePage',
  components: {
    Card,
    TablePage,
    Dialog,
    Tree,
    Pagination
  }
})
export default class extends Mixins(BaseVue) {
  get state(): TreePage {
    return this.$state as TreePage
  }
}
</script>

<style lang="scss" scoped>
.tree-page {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  .tree-page-main {
    display: inline-block;
    width: 50%;
  }
  .tree-page-list {
    display: inline-block;
    width: 50%;
    vertical-align: top;
    min-height: 300px;
  }
}
</style>
