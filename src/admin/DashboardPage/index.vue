<template>
  <Card
    :path="getChildPath('card')"
    class="dashboard-page"
  >
    <Form
      v-if="state.filter"
      :path="getChildPath('filter')"
      class="dashboard-page-filter"
    />
    <draggable
      id="draggable-panel"
      :class="[state.options && state.options.disabled ? 'no-drag-board' : 'drag-board']"
      :list="state.items"
      :options="state.options"
      :style="{}"
      @end="end"
    >
      <AdminComponent
        v-for="(item, index) in state.items"
        :key="index"
        :path="getChildPath(`items[${index}]`)"
        class="item"
      />
    </draggable>
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
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import BaseVue from '@/admin/base/BaseVue'
import { DashboardPage } from './DashboardPageState'
import Card from '@/admin/common/Card/index.vue'
import Dialog from '@/admin/common/Dialog/index.vue'
import Pagination from '@/admin/common/data/Pagination/index.vue'
import Form from '@/admin/common/Form/index.vue'
import draggable from 'vuedraggable'

@Component({
  name: 'DashboardPage',
  components: {
    Card,
    Dialog,
    draggable,
    Pagination,
    Form
  }
})
export default class extends Mixins(BaseVue) {
  get state(): DashboardPage {
    return this.$state as DashboardPage
  }

  end() {
    const action = this.state.endAction
    if (action) {
      this.runAction(action)
    }
  }
}
</script>

<style lang="scss" scoped>
.drag-board {
  .item {
    &:hover {
      cursor: move;
    }
  }
}
</style>
