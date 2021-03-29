import { FunctionNode } from 'arkfbp/lib/functionNode'
import { runFlowByFile } from '@/arkfbp/index'

export class FetchTableList extends FunctionNode {
  async run() {
    await runFlowByFile('flows/treePage/fetchTableList', this.inputs) 
  }
}
