<template>
  <Card
    :path="getChildPath('card')"
    class="dashboard-page"
  >
    <draggable
      v-if="state.items && state.items.length > 0"
      :list="state.items"
      :options="state.options"
      class="drag-board"
      @end="end"
    >
      <AdminComponent
        v-for="(item, index) in state.items"
        :key="index"
        :path="getChildPath(`items[${index}]`)"
        class="item"
      />
    </draggable>
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
import draggable from 'vuedraggable'

@Component({
  name: 'DashboardPage',
  components: {
    Card,
    Dialog,
    draggable
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
