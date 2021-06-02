import InputState from '../Input/InputState'
import { FlowState } from '@/admin/base/BaseVue'

export default interface InputLinkState extends InputState {
  action?: Array<FlowState | Function>
  file?: File
}