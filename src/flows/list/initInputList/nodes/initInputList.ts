import { AuthApiNode } from '@/nodes/authApiNode'
import getInitContent from '@/utils/get-init-content'
import { ITagPage } from '@/config/openapi'
import { runFlowByFile } from '@/arkfbp/index'

export class InitInputList extends AuthApiNode {
  async run() {
    const tempState = this.getState()
    const params = this.inputs.params
    const path = this.inputs.com.path
    
    // 给 第二层弹出框的 点击按钮添加 path 参数
    // 以便其在确认后将对应的值赋值给点击的DOM元素
    tempState.dialogs.selected.actions[0].action[0].params = {
      ...params,
      path: path
    }

    // 获取当前的数据内容  --  初始化List的右侧内容
    const nowInputListData = [...this.inputs.com.state.options]
    
    // 通过page字段信息获取list的初始化资源  --  初始化List的左侧内容
    const initContent: ITagPage | undefined  = getInitContent(params.page)
    // 通过initContent.type来判断初始化的类型
    if (initContent && initContent.type) {
      if (initContent.type === 'tree_page') {
        await runFlowByFile('flows/treePage/init', {
          initContent: initContent,
        }).then((data) => {
          // 根据初始化公用流返回的state初始化此InputList弹出框的内容 -- 弹出框的内容只需要此时data.state中的tree相关的内容
          tempState.dialogs.selected.state.treePage = {
            ...data.state,
            table: null,
            list: tempState.dialogs.selected.state.treePage.list
          }
          tempState.dialogs.selected.state.tablePage.table = null
          tempState.dialogs.selected.state.treePage.tree.nodes.action.push({
            name: 'flows/list/clicked',
            params: {
              multi: params.multi,
              field: params.field,
              type: 'tree'
            }
          })
          tempState.dialogs.selected.state.treePage.list.header = {
            title: '已选数据列表' || ''
          }
          tempState.dialogs.selected.state.treePage.list.data.items.length = 0
          tempState.dialogs.selected.state.treePage.list.data.items = nowInputListData
        })
      } else if (initContent.type === 'table_page') {
        await runFlowByFile('flows/tablePage/init', {
          initContent: {
            ...initContent,
            hiddenReadOnly: true
          }
        }).then((data) => {
          // 根据初始化公用流返回的state初始化此InputList弹出框的内容 -- 此时的tablePage只需要data.state中的部分内容
          tempState.dialogs.selected.state.tablePage = {
            ...data.state,
            list: tempState.dialogs.selected.state.tablePage.list
          }
          tempState.dialogs.selected.state.treePage.tree = null
          tempState.dialogs.selected.state.tablePage.table.selection = {
            exist: params.multi,
            values: []
          }
          tempState.dialogs.selected.state.tablePage.table.selectAction = [
            {
              name: 'flows/list/clicked',
              params: {
                multi: params.multi,
                type: 'table',
                field: params.field
              }
            }
          ]
          tempState.dialogs.selected.state.tablePage.list.header = {
            title: '已选数据列表' || ''
          }
          tempState.dialogs.selected.state.tablePage.list.data.items.length = 0
          tempState.dialogs.selected.state.tablePage.list.data.items = nowInputListData
        })
      }
    }
    // 最后，打开对话框
    tempState.dialogs.selected.visible = true
  }
}