<template>
  <div class="tree-page">
    <Card
      :class="['tree__card', {'tree__card__half': isExistList}]"
      :path="getChildPath('card')"
    >
      <Tree :path="getChildPath('tree')" />
      <template v-if="state.dialogs">
        <Dialog
          v-for="dialogName in Object.keys(state.dialogs)"
          :key="dialogName"
          :path="getChildPath('dialogs.' + dialogName)"
        />
      </template>
    </Card>
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
import { TreePage } from './TreePageState'
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
  get state(): TreePage {
    return this.$state as TreePage
  }

  get isExistList(): boolean {
    return !!this.state.list
  }
}
</script>

<style lang="scss" scoped>
.tree-page {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  .tree__card {
    height: 100%;
    min-height: 300px;
    width: 100%;
    display: inline-block;
    &.tree__card__half {
      width: 50%;
    }
  }
  .treepage__list {
    display: inline-block;
    width: 50%;
    vertical-align: top;
    min-height: 300px;
  }
}
</style>
