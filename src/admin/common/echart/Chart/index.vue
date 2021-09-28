<template>
  <Card :path="getChildPath('card')">
    <div :id="id" />
  </Card>
</template>

<script lang="ts">
import echarts, { EChartOption } from 'echarts'
import { Component, Mixins, Watch } from 'vue-property-decorator'
import ResizeMixin from '@/components/Charts/mixins/resize'
import ChartState from './ChartState'
import BaseVue from '@/admin/base/BaseVue'
import Card from '@/admin/common/Card/index.vue'

@Component({
  name: 'Chart',
  components: {
    Card
  }
})
export default class extends Mixins(ResizeMixin, BaseVue) {
  get state(): ChartState {
    return this.$state as ChartState
  }

  get id() {
    return this.state.id
  }

  @Watch('state')
  onChartStateChange() {
    this.setOptions()
  }

  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  }

  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
  }

  private initChart() {
    this.chart = echarts.init(document.getElementById(this.id) as HTMLDivElement)
    this.setOptions()
  }

  private setOptions() {
    const data = this.state.chart
    if (this.chart && data) {
      this.chart.setOption(data)
    }
  }
}
</script>
