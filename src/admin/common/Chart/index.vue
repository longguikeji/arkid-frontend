<template>
  <div />
</template>

<script lang="ts">
import echarts, { EChartOption } from 'echarts'
import { Component, Mixins, Watch } from 'vue-property-decorator'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'Chart'
})
export default class extends Mixins(BaseVue) {
  private chart: echarts.ECharts | null = null

  get state() {
    return this.$state
  }

  @Watch('state')
  onChartStateChange(state) {
    this.setChartOption(state)
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
    this.setChartOption(this.state as EChartOption)
  }

  setChartOption(option: EChartOption) {
    this.chart!.setOption(option)
  }
}
</script>
