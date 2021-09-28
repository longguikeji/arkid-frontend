import { BaseState } from '@/admin/base/BaseVue'
import ButtonState from '../Button/ButtonState'

export default interface CardState extends BaseState {
  title?: string
  buttons?: Array<ButtonState>
  showHeader?: boolean
  shadow?: string
}
