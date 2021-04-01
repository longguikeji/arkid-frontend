import { FunctionNode } from 'arkfbp/lib/functionNode'
import OpenAPI from '@/config/openapi'

export class InitTree extends FunctionNode {
  async run() {
    const tempState = this.inputs.state
    const initContent = this.inputs.data.initContent
    // 获取节点列表
    if (initContent.treeList) {
      const treeListOperationPath = initContent.treeList.path
      const treeListOperationMethod = initContent.treeList.method
      const treeListOperation = OpenAPI.instance.getOperation(treeListOperationPath, treeListOperationMethod)
      if (treeListOperation) {
        // 给treePage页面的created赋值 -- 获取tree节点数据和默认的table表格内容
        tempState.created.push({ 
          name: "flows/treePage/fetchTreeNode",
          params: {
            fetchUrl: treeListOperationPath,
            fetchMethod: treeListOperationMethod,
          }
        })
        // 给tree结构的最上方header模块的title赋值
        tempState.tree.header.title = treeListOperation.summary || ''
        // 给tree添加控制节点展开的内容属性 defaultExpandedKeys
        tempState.tree.nodes.defaultExpandedKeys = []
      }
    }
    if (initContent.childrenList && initContent.tableList) {
      const treeNodeDataOperationPath = initContent.childrenList.path
      const treeNodeDataOperationMethod = initContent.childrenList.method
      const tableListOperationPath = initContent.tableList.path
      const tableListOperationMethod = initContent.tableList.method
      // 给tree添加节点触发事件
      tempState.tree.nodes.action = [
        {
          name: "flows/treePage/fetchTreeNodeChildren",
          params: {
            fetchUrl: treeNodeDataOperationPath,
            fetchMethod: treeNodeDataOperationMethod,
            tableUrl: tableListOperationPath,
            tableMethod: tableListOperationMethod
          }
        }
      ]
    }
    return {
      data: this.inputs.data,
      state: tempState,
    }
  }
}
