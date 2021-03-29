<template>
  <div />
</template>

<script lang="ts">
import echarts, { EChartOption } from 'echarts'
import { Component, Mixins, Watch } from 'vue-property-decorator'
import ResizeMixin from '@/components/Charts/mixins/resize'
import PieChartState from './PieChartState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'PieChart'
})
export default class extends Mixins(ResizeMixin, BaseVue) {
  get state(): PieChartState {
    return this.$state as PieChartState
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

  @Watch('state', { deep: true })
  private onChartDataChange(value: PieChartState) {
    this.setOptions(value)
  }

  public initChart() {
    this.chart = echarts.init(this.$el as HTMLDivElement, 'macarons')
    this.setOptions(this.state)
  }

  private setOptions(state: PieChartState) {
    if (this.chart) {
      const legendData:string[] = []
      if (state.datas) {
        state.datas.forEach(data => {
          legendData.push(data.name || '')
        })
      }

      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: legendData
        },
        series: [
          {
            name: state.title,
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: state.datas
            // animationEasing: 'cubicInOut',
            // animationDuration: 2600
          }
        ]
      }as EChartOption<EChartOption.SeriesPie>)
    }
  }
}
</script>
