import StepState from './StepState'
import { BaseState } from '@/admin/base/BaseVue'

export default interface StepsState extends BaseState {
  space?: number|string; // 每个 step 的间距，不填写将自适应间距。支持百分比。 
  direction?: string; // 显示方向 vertical/horizontal  horizontal
  active?: number; // 设置当前激活步骤 
  processStatus?: string; // 设置当前步骤的状态 wait / process / finish / error / success  process
  finishStatus?: string; // 设置结束步骤的状态 wait / process / finish / error / success  finish
  alignCenter?: boolean; // 进行居中对齐 false
  simple?: boolean; // 是否应用简洁风格  fasle
  step?: Array<StepState>; // 步骤条内容
}