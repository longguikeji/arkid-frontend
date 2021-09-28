import CardState from '@/admin/common/Card/CardState'
import { EChartOption } from 'echarts'

export default interface ChartState {
  id: string
  card?: CardState
  chart?: EChartOption
}