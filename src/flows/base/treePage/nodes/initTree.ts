import { FunctionNode } from 'arkfbp/lib/functionNode'
import OpenAPI from '@/config/openapi'
import TreePageState from '@/admin/TreePage/TreePageState'

export class InitTree extends FunctionNode {
  async run() {
    const tempState: TreePageState = this.inputs.state
    const { initContent } = this.inputs.data
    
    // 获取节点列表
    if (initContent.init) {
      const initTreePath = initContent.init.path
      const initTreeMethod = initContent.init.method
      const initTreeOperation = OpenAPI.instance.getOperation(initTreePath, initTreeMethod)
      if (initTreeOperation) {
        // 给treePage页面的进行fetch-action的添加
        tempState.actions!['fetch'] = [
          {
            name: 'arkfbp/flows/fetch',
            url: initTreePath,
            method: initTreeMethod,
          }
        ]
        tempState.actions!['created'].push('fetch')
        // 给 destroyed 赋值
        tempState.destroyed = 'destroyed'
        tempState.actions!['destroyed'] = [
          {
            name: 'arkfbp/flows/hookFlow/destroyed',
            url: initTreePath,
            method: initTreeMethod,
          }
        ]
        // 给tree结构的最上方header模块的title赋值 -- 此外这里可以对tree进行扩展性的赋值，以实现更加丰富的功能
        // 比如，可以增加默认选中节点等属性内容
        tempState.tree!.header!.title = initTreeOperation.summary || ''
      }
    }

    // 子节点内容
    if (initContent.item.children) {
      const treeNodeDataOperationPath = initContent.item.children.path
      const treeNodeDataOperationMethod = initContent.item.children.method
      const tableListOperationPath = initContent.table.init.path
      const tableListOperationMethod = initContent.table.init.method
      // 给tree添加节点触发事件
      tempState.tree!.nodes!.action = 'fetchTreeNodeChildren'
      tempState.actions!['fetchTreeNodeChildren'] = [
        {
          name: "flows/treePage/fetchTreeNodeChildren",
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
