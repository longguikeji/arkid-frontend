import CardState from '../common/Card/CardState'
import TableState from '../common/data/Table/TableState'
import FormState from '../common/Form/FormState'
import PaginationState from '../common/data/Pagination/PaginationState'
import { BaseState } from '../base/BaseVue'
import DialogState from '../common/Others/Dialog/DialogState'

export default interface TablePageState extends BaseState {
  filter?: FormState
  table?: TableState
  pagination?: PaginationState
  card?: CardState
  dialogs?: {[name:string]:DialogState}
}
