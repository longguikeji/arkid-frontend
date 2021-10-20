<template>
  <Card
    :path="getChildPath('card')"
    class="dashboard-page"
  >
    <DragBoard :path="getChildPath('board')" />
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

@Component({
  name: 'DashboardPage',
  components: {
    Card,
    Dialog
  }
})
export default class extends Mixins(BaseVue) {
  get state(): DashboardPage {
    return this.$state as DashboardPage
  }
}
</script>
