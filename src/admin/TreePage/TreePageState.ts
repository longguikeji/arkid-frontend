import { BaseState } from '../base/BaseVue'
import TablePageState from '../TablePage/TablePageState'
import TreeState from '../common/data/Tree/TreeState'
import CardState from '../common/Card/CardState'
import DialogState from '../common/Others/Dialog/DialogState'
import ListState from '@/admin/common/data/List/ListState' 

export interface Tree {
  header?: CardState,
  nodes?: TreeState,
}

export default interface TreePageState extends BaseState {
  type: 'TreePage'
  tree?: Tree
  table?: TablePageState
  dialogs?: { [dialogName: string]: DialogState }
  pages?: Array<string>
  list?: {
    header?: CardState,
    data?: ListState
  }
}
