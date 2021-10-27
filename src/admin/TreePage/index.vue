<template>
  <div class="tree-page">
    <Card
      :class="[{'tree-list-page': !!state.list}]"
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
    <List
      v-if="state.list"
      :path="getChildPath('list')"
      class="tree-page-list"
    />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import Card from '@/admin/common/Card/index.vue'
import Tree from '@/admin/common/data/Tree/index.vue'
import Dialog from '@/admin/common/Dialog/index.vue'
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
  height: calc(100vh - 86px - 2rem);
  box-sizing: border-box;
  overflow: hidden;
  .el-card {
    height: calc(100vh - 86px - 2rem);
  }
  .tree-list-page {
    display: inline-block;
    width: 70%;
  }
  .tree-page-list {
    display: inline-block;
    width: 30%;
    vertical-align: top;
    min-height: 300px;
  }
  ::v-deep .el-card {
    .el-card__body {
      height: calc(100vh - 86px - 2rem);
      position: relative;
      overflow: auto;
      .el-pagination {
        position: absolute;
        bottom: 70px;
      }
    }
  }
}
</style>
