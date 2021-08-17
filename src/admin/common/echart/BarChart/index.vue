<template>
  <div />
</template>

<script lang="ts">
import echarts, { EChartOption } from 'echarts'
import { Component, Mixins, Watch } from 'vue-property-decorator'
import ResizeMixin from '@/components/Charts/mixins/resize'
import BarChartState from './BarChartState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'BarChart'
})
export default class extends Mixins(ResizeMixin, BaseVue) {
  get state(): BarChartState {
    return this.$state as BarChartState
  }

  @Watch('state', { deep: true })
  private onChartDataChange(value: BarChartState) {
    this.setOptions(value)
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

  private setOptions(state: BarChartState) {
    if (this.chart) {
      const legendData:string[] = []
      const seriesData: object[] = []
      if (state.series !== null) {
        state.series?.forEach((serie) => {
          legendData.push(serie.name || '')
          seriesData.push({
            name: serie.name,
            type: 'bar',
            data: serie.data
          })
        })
      }

      this.chart.setOption({
        title: {
          text: state.header?.text,
          subtext: state.header?.subtext
        },
        xAxis: {
          data: state.xAxis,
          type: 'category',
          axisLabel: {
            interval: 0
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: 8
        },
        grid: {
          height: 300
        },
        yAxis: {
          type: 'value'
        },
        legend: {
          data: legendData
        },
        series: seriesData
      } as EChartOption<EChartOption.SeriesLine>)
    }
  }
}
</script>
