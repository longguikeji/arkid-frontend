import { BaseState } from '@/admin/base/BaseVue'
import FormItemState from './FormItem/FormItemState'

export default interface FormState extends BaseState {
  items?: FormItemsState
  inline?: boolean
  size?: string
  disabled?: boolean
  labelPosition?: string
  labelWidth?: string
  labelSuffix?: string
}

export interface FormItemsState {
  [prop:string]:FormItemState | FormItemsState
}
