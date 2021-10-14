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
import DashboardItem from './DashboardItem/index.vue'
import { DashboardPage } from './DashboardPageState'
import DashboardItemState from './DashboardItem/DashboardItemState'
import BaseVue from '@/admin/base/BaseVue'
import { DesktopModule, IDesktopSingleApp } from '@/store/modules/desktop'
import { ConfigModule } from '@/store/modules/config'
import { getToken } from '@/utils/auth'
import { runFlowByFile } from '@/arkfbp'
import Card from '@/admin/common/Card/index.vue'
import Dialog from '@/admin/common/Others/Dialog/index.vue'

@Component({
  name: 'DashboardPage',
  components: {
    DashboardItem,
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
