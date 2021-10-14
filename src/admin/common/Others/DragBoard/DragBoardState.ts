import { BaseState } from '@/admin/base/BaseVue'
import CardPanelState from '../CardPanel/CardPanelState'

export default interface DragBoardState extends BaseState{
  list?: CardPanelState[]
  options?: any
  changeAction?: string | Function
  moveAction?: string | Function
  startAction?: string | Function
  endAction?: string | Function
}