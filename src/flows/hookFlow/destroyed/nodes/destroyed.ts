import { StateNode } from '@/nodes/stateNode'
import { runFlowByFile } from '@/arkfbp/index'

export class Destroyed extends StateNode {
  async run() {
    // 上一个页面销毁后，应该此时去执行对应类型的下一个页面内容
    const tempState = this.getState()
    const inputs = tempState?.destroyed?.length && tempState.destroyed[0]
    if (inputs) {
      if (tempState.type === 'TablePage') {
        await runFlowByFile('flows/tablePage/fetch', inputs)
      } else if (tempState.type === 'FormPage') {
        await runFlowByFile('flows/formPage/fetch', inputs)
      } else if (tempState.type === 'TreePage') {
        await runFlowByFile('flows/treePage/fetchTreeNode', inputs)
      }
    }
  }
}
