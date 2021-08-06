import { FunctionNode } from 'arkfbp/lib/functionNode'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'

export class Group extends FunctionNode {
  async run() {
    const { state, page } = this.inputs
    const pageState: AdminComponentState = state[page]
    const fetchTableName = 'group_user.fetch'
    pageState.state.actions.fetch.push(fetchTableName)
    pageState.state.actions.fetchTreeNode.push(fetchTableName)
  }
}
