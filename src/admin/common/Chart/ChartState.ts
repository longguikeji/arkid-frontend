import { EChartOption } from 'echarts'

export default interface ChartState {
  id: string
  title?: string
  options?: EChartOption
}