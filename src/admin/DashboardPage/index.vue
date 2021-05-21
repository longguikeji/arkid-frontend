<template>
  <div class="dashboard-page">
    <iframe
      v-if="app.url"
      ref="singleAppWindow"
      class="single-app-page"
      :src="app.url"
    />
    <grid-layout
      v-else
      :layout.sync="layout"
      :col-num="8"
      :is-draggable="true"
      :is-resizable="true"
      :is-mirrored="false"
      :responsive="true"
      :vertical-compact="true"
      :margin="[32, 32]"
      :use-css-transforms="true"
    >
      <grid-item
        v-for="item in layout"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        @resized="resizedHandler"
      >
        <DashboardItem
          :path="getChildPath('items[' + item.i + ']')"
          @appClick="showAppPage"
        />
      </grid-item>
    </grid-layout>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import DashboardItem from './DashboardItem/index.vue'
import { DashboardPage } from './DashboardPageState'
import DashboardItemState from './DashboardItem/DashboardItemState'
import VueGridLayout from 'vue-grid-layout'
import BaseVue from '@/admin/base/BaseVue'

// 将屏幕width分为8份，每份为一标准高宽，允许内部所有组件高宽只能是整数倍
@Component({
  name: 'DashboardPage',
  components: {
    DashboardItem,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  }
})
export default class extends Mixins(BaseVue) {
  private layout?: any[] = [] // 必须有初始值
  private app: any = {}

  get state(): DashboardPage {
    return this.$state as DashboardPage
  }

  get items(): DashboardItemState[] | undefined {
    return this.state.items
  }

  @Watch('items', { immediate: true })
  freshLayout() {
    if (this.items === undefined) { return }
    this.layout?.splice(0, this.layout.length)
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i]
      if (item.position) { item.position.i = i }
      this.layout?.push(item.position)
    }
  }

  @Watch('$route')
  onRouteChange() {
    this.updateDesktopPage()
  }

  mounted() {
    this.updateDesktopPage()
  }

  resizedHandler(i:number, newH:number, newW:number) {
    if (this.items) {
      const item = this.items[i]
      if (item.position) {
        item.position.h = newH
        item.position.w = newW
      }
    }
  }

  updateDesktopPage() {
    const appUUId = this.$route.query.app
    const items = this.items
    if (appUUId && items) {
      for (const item of items) {
        if (item.state.uuid === appUUId) {
          this.app = item.state
        }
      }
    } else {
      this.app = {}
    }
  }

  showAppPage(data: any) {
    if (data.url && data.uuid) {
      this.$router.push({
        path: '/',
        query: {
          app: data.uuid
        }
      })
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
.dashboard-page {
  height: calc(100vh - 84px);
  overflow: auto;
  .single-app-page {
    width: 100%;
    height: 100%;
  }
  ::v-deep .vue-grid-item {
    touch-action: none;
  }
}
</style>
