import { BaseState } from '@/admin/base/BaseVue'
import TreePageState from '@/admin/TreePage/TreePageState'
import TablePageState from '@/admin/TablePage/TablePageState'
import CardState from '@/admin/common/Card/CardState'
import ListState from '@/admin/common/data/List/ListState'

export default interface ListAssemblyState extends BaseState {
  treePage?: TreePageState,
  tablePage?: TablePageState,
  selected?: {  // 已选择的内容存放区域 -- 包含 已选择区域的“header头部”和“list数据”
    header?: CardState,
    list?: ListState
  }
}
