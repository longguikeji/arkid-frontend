import { FunctionNode } from 'arkfbp/lib/functionNode'

export class CloseNode extends FunctionNode {
  async run() {
    const com = this.inputs.com
    const pathChains = com.path.split('.')
    const dialogLastIndex = pathChains.lastIndexOf('dialogs')
    const path = pathChains.slice(0, dialogLastIndex + 2).join('.')
    const state = com.getAnyStateByPath(path)
    state.visible = false
    await com.runAction('created', pathChains.slice(0, dialogLastIndex - 1).join('.'))
  }
}