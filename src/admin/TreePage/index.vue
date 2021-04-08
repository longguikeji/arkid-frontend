<template>
  <div class="tree-page">
    <Card
      class="tree__card"
      :path="getChildPath('tree.header')"
    >
      <Tree :path="getChildPath('tree.nodes')" />
      <template v-if="state.dialogs">
        <Dialog
          v-for="dialogName in Object.keys(state.dialogs)"
          :key="dialogName"
          :path="getChildPath('dialogs.' + dialogName)"
        />
      </template>
    </Card>
    <template v-if="state.table">
      <TablePage
        class="tree__table"
        :path="getChildPath('table')"
      />
    </template>
    <template v-if="state.list">
      <Card
        :path="getChildPath('list.header')"
        class="treepage__list"
      >
        <List :path="getChildPath('list.data')" />
      </Card>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import Card from '@/admin/common/Card/index.vue'
import Tree from '@/admin/common/data/Tree/index.vue'
import Dialog from '@/admin/common/Others/Dialog/index.vue'
import TablePage from '@/admin/TablePage/index.vue'
import TreePageState from './TreePageState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'TreePage',
  components: {
    Card,
    TablePage,
    Dialog,
    Tree
  }
})
export default class extends Mixins(BaseVue) {
  get state(): TreePageState {
    return this.$state as TreePageState
  }
}
</script>

<style lang="scss" scoped>
.tree-page {
  position: relative;
  display: block;
  width: 100%;
  height: calc(100vh - 84px);
  .tree__card {
    display: inline-block;
    width: 30%;
    height: 100%;
  }
  .tree__table {
    display: inline-block;
    width: 70%;
    height: 100%;
  }
  .treepage__list {
    display: inline-block;
    width: 50%;
    position: absolute;
    top: 0px;
  }
}
</style>
