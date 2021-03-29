import { BaseState } from '@/admin/base/BaseVue'

interface PieData {
  name?: string
  value?: string
}

export default interface PieChartState extends BaseState {
  title?: string
  datas?: Array<PieData>
}
