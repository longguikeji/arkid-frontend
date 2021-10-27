import { BaseState } from '../base/BaseVue'
import TreeState from '../common/data/Tree/TreeState'
import CardState from '../common/Card/CardState'
import DialogState from '@/admin/common/Dialog/DialogState'
import PaginationState from '../common/data/Pagination/PaginationState'
import ListState from '@/admin/common/List/ListState' 
import { IFlow } from '@/arkfbp'

export interface TreePage extends BaseState {
  card?: CardState
  data?: any
  tree?: TreeState
  dialogs?: { [dialogName: string]: DialogState }
  list?: ListState
  actions?: { [name: string]: Array<IFlow | string> }
  pagination?: PaginationState
}