import { BaseState } from '@/admin/base/BaseVue'
import TreePageState from '@/admin/TreePage/TreePageState'
import TablePageState from '@/admin/TablePage/TablePageState'

export default interface ListAssemblyState extends BaseState {
  treePage?: TreePageState,
  tablePage?: TablePageState,
}
