import TablePageState from '../TablePage/TablePageState'
import TreeState from '../common/data/Tree/TreeState'
import CardState from '../common/Card/CardState'
import DialogState from '../common/Others/Dialog/DialogState'
import { BaseState } from '../base/BaseVue'

export interface Tree {
  header?: CardState,
  nodes?: TreeState,
}

export default interface TreePageState extends BaseState {
  tree?: Tree
  table?: TablePageState
  dialogs?: { [dialogName: string]: DialogState }
}
