import { BaseState } from '@/admin/base/BaseVue'

export default interface CardPanelState extends BaseState {
  color?: string
  img?: string
  action?: string // flow name
  url?: string
  description?: string
}
