import { BaseState } from '../base/BaseVue'
import CardState from '../common/Card/CardState'
import TableState from '../common/data/Table/TableState'
import FormState from '../common/Form/FormState'
import PaginationState from '../common/data/Pagination/PaginationState'
import DialogState from '../common/Others/Dialog/DialogState'
import ListState from '@/admin/common/data/List/ListState' 
import { FlowConfig } from '@/arkfbp'

export default interface TablePageState extends BaseState {
  type: 'TablePage'
  filter?: FormState
  table?: TableState
  pagination?: PaginationState
  card?: CardState
  dialogs?: { [name:string]: DialogState }
  pages?: Array<string>
  list?: {
    header?: CardState,
    data?: ListState
  }
  actions?: { [name: string]: (FlowConfig | string)[] }
}
