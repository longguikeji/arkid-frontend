<template>
  <el-card>
    <div
      slot="header"
      class="chart-title"
    >
      <span>{{ state.title }}</span>
    </div>
    <div ref="chart" />
  </el-card>
</template>

<script lang="ts">
import echarts, { EChartOption } from 'echarts'
import { Component, Mixins, Watch } from 'vue-property-decorator'
import BaseVue from '@/admin/base/BaseVue'
import ChartState from './ChartState'

@Component({
  name: 'Chart'
})
export default class extends Mixins(BaseVue) {
  private chart

  get state(): ChartState {
    return this.$state as ChartState
  }

  get options() {
    return this.state.options
  }

  @Watch('options', { deep: true })
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
    this.chart = echarts.init(this.$refs.chart as HTMLDivElement, 'macarons')
  }

  setOptions(options) {
    if (this.chart) {
      this.chart.setOption(options)
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-title {
  font-size: 16px;
  font-weight: bold;
}
</style>
