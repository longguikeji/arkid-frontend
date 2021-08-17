<template>
  <component
    :is="item"
  />
</template>
<script lang="ts">
import DashboardItemState from '@/admin/DashboardPage/DashboardItem/DashboardItemState'
import { Component, Mixins } from 'vue-property-decorator'
import CardPanel from '@/admin/common/panel/CardPanel/index.vue'
import LineChart from '@/admin/common/echart/LineChart/index.vue'
import PieChart from '@/admin/common/echart/PieChart/index.vue'
import BarChart from '@/admin/common/echart/BarChart/index.vue'
import ListPanel from '@/admin/common/panel/ListPanel/index.vue'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'DashboardItem',
  components: {
    CardPanel,
    LineChart,
    PieChart,
    BarChart,
    ListPanel
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
        LineChart,
        PieChart,
        BarChart,
        ListPanel
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

  private handleClick() {
    const item = this.state.state
    this.$emit('appClick', item, this.state.type)
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
