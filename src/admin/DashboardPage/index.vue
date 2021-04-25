<template>
  <div class="background">
    <grid-layout
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
        <DashboardItem :path="getChildPath('items[' + item.i + ']')" />
      </grid-item>
    </grid-layout>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import DashboardItem from './DashboardItem/index.vue'
import DashboardPageState from './DashboardPageState'
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
  get state(): DashboardPageState {
    return this.$state as DashboardPageState
  }

  get items(): DashboardItemState[] | undefined {
    return this.state.items
  }

  private layout?:any[] = [];// 必须有初始值

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

  resizedHandler(i:number, newH:number, newW:number) {
    if (this.state.items) {
      const item = this.state.items[i]
      if (item.position) {
        item.position.h = newH
        item.position.w = newW
      }
    }
  }
}
</script>
