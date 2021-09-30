import { BaseState } from '@/admin/base/BaseVue'

export default interface CardPanelState extends BaseState {
  color?: string
  logo?: string
  action?: string // flow name
  url?: string
  description?: string
}
