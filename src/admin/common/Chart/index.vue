<template>
  <div />
</template>

<script lang="ts">
import echarts, { EChartOption } from 'echarts'
import { Component, Mixins, Watch } from 'vue-property-decorator'
import ResizeMixin from '@/components/Charts/mixins/resize'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'LineChart'
})
export default class extends Mixins(BaseVue) {
  private chart

  get state() {
    return this.$state
  }

  @Watch('state', { deep: true })
  onChartStateChange(options) {
    this.setOptions(options)
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
    this.chart = echarts.init(this.$el as HTMLDivElement, 'macarons')
    this.setOptions(this.state)
  }

  setOptions(options) {
    if (this.chart) {
      this.chart.setOption(options)
    }
  }
}
</script>
