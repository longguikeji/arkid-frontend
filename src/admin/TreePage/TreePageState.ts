import { BaseState } from '../base/BaseVue'
import TreeState from '../common/data/Tree/TreeState'
import CardState from '../common/Card/CardState'
import DialogState from '../common/Others/Dialog/DialogState'
import PaginationState from '../common/data/Pagination/PaginationState'
import ListItemState from '@/admin/common/data/List/ListState' 
import { IFlow } from '@/arkfbp'

export interface TreePage extends BaseState {
  name?: string
  card?: CardState
  data?: any
  tree?: TreeState
  dialogs?: { [dialogName: string]: DialogState }
  list?: {
    header?: CardState,
    data?: Array<ListItemState>
  }
  actions?: { [name: string]: Array<IFlow | string> }
  pagination?: PaginationState
}