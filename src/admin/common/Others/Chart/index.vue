<template>
  <el-container />
</template>

<script lang="ts">
import echarts, { EChartOption } from 'echarts'
import { Component, Mixins, Watch } from 'vue-property-decorator'
import BaseVue from '@/admin/base/BaseVue'
import Card from '@/admin/common/Card/index.vue'

@Component({
  name: 'Chart',
  components: {
    Card
  }
})
export default class extends Mixins(BaseVue) {
  private chart: echarts.ECharts | null = null

  get state() {
    return this.$state
  }

  @Watch('state')
  onChartStateChange() {
    this.setChartOption()
  }

  mounted() {
    setTimeout(() => {
      this.initChart()
    }, 1)
  }

  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  }

  private initChart() {
    this.chart = echarts.init(this.$el as HTMLDivElement)
    this.setChartOption()
  }

  setChartOption() {
    const option = this.state as EChartOption
    if (this.chart && option) {
      option.title = {
        ...option.title,
        textStyle: {
          fontSize: 12
        }
      }
      this.chart!.setOption(option)
    }
  }
}
</script>
