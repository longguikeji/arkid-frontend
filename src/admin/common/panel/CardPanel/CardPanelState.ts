import { BaseState } from '@/admin/base/BaseVue'

export default interface CardPanelState extends BaseState {
  color?: string
  icon?: string
  title?: string
  number?: number
  action?: string // flow name
}
