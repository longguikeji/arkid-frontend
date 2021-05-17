import { FunctionNode } from 'arkfbp/lib/functionNode'
import OpenAPI from '@/config/openapi'
import { TreePage } from '@/admin/TreePage/TreePageState'

export class InitTree extends FunctionNode {
  async run() {
    const tempState: TreePage = this.inputs.state
    const { initContent } = this.inputs.data
    // 获取节点列表
    if (initContent.init) {
      const initTreePath = initContent.init.path
      const initTreeMethod = initContent.init.method
      const initTreeOperation = OpenAPI.instance.getOperation(initTreePath, initTreeMethod)
      if (initTreeOperation) {
        // 给treePage页面的进行fetch-action的添加
        tempState.actions!.fetch = [
          {
            name: 'arkfbp/flows/fetch',
            url: initTreePath,
            method: initTreeMethod,
            response: {
              'tree.data': ''
            }
          }
        ]
        tempState.actions!.created.push('fetch')
        // 给tree结构的最上方header模块的title赋值 -- 此外这里可以对tree进行扩展性的赋值，以实现更加丰富的功能
        // 比如，可以增加默认选中节点等属性内容
        tempState.card!.title = initTreeOperation.summary || ''
      }
    }

    // 子节点内容
    if (initContent.item.children) {
      const treeNodeDataOperationPath = initContent.item.children.path
      const treeNodeDataOperationMethod = initContent.item.children.method
      // 给tree添加节点触发事件
      tempState.tree!.action = 'fetchTreeNodeChildren'
      tempState.actions!.fetchTreeNodeChildren = [
        {
          name: "arkfbp/flows/fetch",
          url: treeNodeDataOperationPath,
          method: treeNodeDataOperationMethod
        }
      ]
    }
    
    return {
      data: this.inputs.data,
      state: tempState
    }
  }
}
