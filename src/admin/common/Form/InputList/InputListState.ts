import SelectState from '../Select/SelectState'
import { FlowState } from '@/admin/base/BaseVue'

export default interface InputListState extends SelectState {
  path?: string
  action?: Array<FlowState | Function>
}
