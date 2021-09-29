<template>
  <component
    :is="item"
  />
</template>
<script lang="ts">
import DashboardItemState from '@/admin/DashboardPage/DashboardItem/DashboardItemState'
import { Component, Mixins } from 'vue-property-decorator'
import CardPanel from '@/admin/common/panel/CardPanel/index.vue'
import Chart from '@/admin/common/Chart/index.vue'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'DashboardItem',
  components: {
    CardPanel,
    Chart
  }
})
export default class extends Mixins(BaseVue) {
  get state(): DashboardItemState {
    return this.$state as DashboardItemState
  }

  get item(): object {
    return {
      components: {
        CardPanel,
        Chart
      },
      render: (h:Function) => {
        return h(
          this.state.type,
          {
            class: 'full',
            props: {
              path: this.getChildPath('state')
            },
            nativeOn: {
              click: this.handleClick
            }
          }
        )
      }
    }
  }

  private handleClick(event) {
    const item = this.state.state
    const className = event.target.className
    if (!className.includes('no-drag')) return
    this.$emit('appClick', item)
  }
}
</script>

<style lang="scss" scoped>
.full{
  width: 100%;
  height: 100%;
  background-color: white;
}
</style>
