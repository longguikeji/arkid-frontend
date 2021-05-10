import { BaseState } from '../base/BaseVue'
import TablePageState from '../TablePage/TablePageState'
import TreeState from '../common/data/Tree/TreeState'
import CardState from '../common/Card/CardState'
import DialogState from '../common/Others/Dialog/DialogState'
import ListItemState from '@/admin/common/data/List/ListState' 
import { FlowConfig } from '@/arkfbp'

export interface Tree {
  header?: CardState,
  nodes?: TreeState,
}

export interface TreePage extends BaseState {
  tree?: Tree
  table?: TablePageState
  dialogs?: { [dialogName: string]: DialogState }
  list?: {
    header?: CardState,
    data?: Array<ListItemState>
  }
  actions: { [name: string]: Array<FlowConfig | string> }
}

export default interface TreePageState {
  type?: string // TreePage
  state?: TreePage
}
