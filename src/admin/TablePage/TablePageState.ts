import { BaseState } from '../base/BaseVue'
import CardState from '../common/Card/CardState'
import TableState from '../common/data/Table/TableState'
import FormState from '../common/Form/FormState'
import PaginationState from '../common/data/Pagination/PaginationState'
import DialogState from '../common/Others/Dialog/DialogState'
import ListState from '@/admin/common/data/List/ListState' 
import { FlowConfig } from '@/arkfbp'

export interface TablePage extends BaseState {
  filter?: FormState
  table?: TableState
  pagination?: PaginationState
  card?: CardState
  dialogs?: { [name:string]: DialogState }
  list?: {
    header?: CardState,
    data?: ListState
  }
  actions?: { [name: string]: (FlowConfig | string)[] }
}

export default interface TablePageState {
  type?: string // TablePage
  state?: TablePage
}