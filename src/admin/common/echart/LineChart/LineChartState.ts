import { BaseState } from '@/admin/base/BaseVue'

interface LineData {
  name?: string

  data?: number[]
}

export default interface LineChartState extends BaseState {

  xAxis?: string[]

  series?: LineData[]

}

// const state = {
//   x_axis: ['a', 'b'],
//   datas: [
//     { name: '', data: [], color: '' },
//     { name: '', data: [], color: '' }
//   ]
// }
