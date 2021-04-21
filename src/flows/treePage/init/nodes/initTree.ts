import { FunctionNode } from 'arkfbp/lib/functionNode'
import OpenAPI from '@/config/openapi'

export class InitTree extends FunctionNode {
  async run() {
    const tempState = this.inputs.state
    const { initContent } = this.inputs.data
    let baseAction = {
      fetchUrl: '',
      fetchMethod: ''
    }
    // 获取节点列表
    if (initContent.init) {
      const initTreePath = initContent.init.path
      const initTreeMethod = initContent.init.method
      baseAction.fetchUrl = initTreePath
      baseAction.fetchMethod = initTreeMethod
      const initTreeOperation = OpenAPI.instance.getOperation(initTreePath, initTreeMethod)
      if (initTreeOperation) {
        // 给treePage页面的created赋值 -- 获取tree节点数据和默认的table表格内容
        tempState.created.push({ 
          name: "flows/treePage/fetchTreeNode",
          params: baseAction
        })
        // 给 destroyed 赋值
        tempState.destroyed.push({
          name: "flows/hookFlow/destroyed",
          params: baseAction
        })
        // 给tree结构的最上方header模块的title赋值
        tempState.tree.header.title = initTreeOperation.summary || ''
        // 给tree添加控制节点展开的内容属性 defaultExpandedKeys
        tempState.tree.nodes.defaultExpandedKeys = []
      }
    }

    // 子节点内容
    if (initContent.item.children) {
      const treeNodeDataOperationPath = initContent.item.children.path
      const treeNodeDataOperationMethod = initContent.item.children.method
      const tableListOperationPath = initContent.table.init.path
      const tableListOperationMethod = initContent.table.init.method
      // 给tree添加节点触发事件
      tempState.tree.nodes.action = [
        {
          name: "flows/treePage/fetchTreeNodeChildren",
          params: {
            url: treeNodeDataOperationPath,
            method: treeNodeDataOperationMethod,
            fetchUrl: tableListOperationPath,
            fetchMethod: tableListOperationMethod
          }
        }
      ]
    }
    
    return {
      data: this.inputs.data,
      state: tempState,
      baseAction: baseAction
    }
  }
}
