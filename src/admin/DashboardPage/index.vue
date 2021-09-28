<template>
  <Card
    :path="getChildPath('card')"
    class="dashboard-page"
  >
    <grid-layout
      class="dashboard-page-grid"
      :layout.sync="layout"
      :is-draggable="isMove"
      :is-resizable="false"
      :is-mirrored="false"
      :responsive="true"
      :vertical-compact="true"
      :margin="[0, 0]"
      :use-css-transforms="true"
    >
      <grid-item
        v-for="item in layout"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :i="item.i"
        :w="item.w"
        :h="item.h"
        drag-ignore-from=".no-drag"
        @move="moveEvent"
      >
        <DashboardItem
          :path="getChildPath('items[' + item.i + ']')"
          @appClick="showAppPage"
        />
      </grid-item>
    </grid-layout>
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
import VueGridLayout from 'vue-grid-layout'
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
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    Card,
    Dialog
  }
})
export default class extends Mixins(BaseVue) {
  private layout: any[] = [] // 必须有初始值

  get state(): DashboardPage {
    return this.$state as DashboardPage
  }

  get items(): DashboardItemState[] | undefined {
    return this.state.items
  }

  get app(): IDesktopSingleApp | null {
    return DesktopModule.desktopCurrentApp
  }

  get token() {
    return getToken()
  }

  get isMove() {
    return (this.state.isDraggable === false) || ConfigModule.desktop.resize || false
  }

  @Watch('items', { immediate: true })
  freshLayout() {
    if (!this.items) return
    this.layout.splice(0, this.layout.length)
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]
      this.layout.push(item.position)
    }
    this.updateDesktopPage()
  }

  @Watch('$route')
  onCurrentAppChange() {
    this.updateDesktopPage()
  }

  async moveEvent(i: number, newX: number, newY: number) {
    const item = this.items![i]
    item.position = {
      ...item.position,
      x: newX,
      y: newY
    }
    await this.gridItemEventHandler()
  }

  async gridItemEventHandler() {
    const items = this.items!.map((item: DashboardItemState) => {
      return {
        ...item.position,
        uuid: item.state.uuid
      }
    })
    await runFlowByFile('flows/custom/desktop/adjust', { items })
  }

  updateDesktopPage() {
    const appUUId = this.$route.query.app
    const items = this.items
    let app: IDesktopSingleApp | null = null
    if (appUUId && items) {
      for (const item of items) {
        if (item.state.uuid === appUUId) {
          app = item.state
        }
      }
    }
    DesktopModule.updateCurrentDesktopApp(app)
  }

  showAppPage(data: any) {
    if (data.url && data.uuid) {
      window.open(data.url, '_blank')
    } else {
      this.$message({
        message: '该应用未设置调转路径或缺少标识信息',
        type: 'info',
        showClose: true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-page-grid {
  height: calc(100vh - 130px) !important;
  overflow: auto;
  .single-app-page {
    width: 100%;
    height: 100%;
  }
  ::v-deep .vue-grid-item {
    touch-action: none;
    width: 307px !important;
    height: 100px !important;
  }
}
</style>
