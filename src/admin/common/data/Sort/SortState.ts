import { BaseState, FlowState } from '@/admin/base/BaseVue'

export default interface SortState extends BaseState {
  type?: string // sort类型，目前有四种类型，up、down、top、bottom
  action?: Array<FlowState | Function> // 对应的动作
}