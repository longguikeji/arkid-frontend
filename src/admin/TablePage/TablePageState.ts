import { BaseState } from '../base/BaseVue'
import CardState from '../common/Card/CardState'
import TableState from '../common/data/Table/TableState'
import FormState from '../common/Form/FormState'
import PaginationState from '../common/data/Pagination/PaginationState'
import DialogState from '@/admin/common/Dialog/DialogState'
import ListState from '@/admin/common/List/ListState' 
import { IFlow } from '@/arkfbp'

export interface TablePage extends BaseState {
  filter?: FormState
  table?: TableState
  pagination?: PaginationState
  data?: any
  card?: CardState
  dialogs?: { [name:string]: DialogState }
  list?: ListState
  actions?: { [name: string]: (IFlow | string)[] }
}