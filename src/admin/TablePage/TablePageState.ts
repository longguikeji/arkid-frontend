import { BaseState } from '../base/BaseVue'
import CardState from '../common/Card/CardState'
import TableState from '../common/data/Table/TableState'
import FormState from '../common/Form/FormState'
import PaginationState from '../common/data/Pagination/PaginationState'
import DialogState from '../common/Others/Dialog/DialogState'
import ListItemState from '@/admin/common/data/List/ListState' 
import { IFlow } from '@/arkfbp'

export interface TablePage extends BaseState {
  filter?: FormState
  table?: TableState
  pagination?: PaginationState
  data?: any
  card?: CardState
  dialogs?: { [name:string]: DialogState }
  list?: {
    header?: CardState,
    data?: Array<ListItemState>
  }
  actions?: { [name: string]: (IFlow | string)[] }
}