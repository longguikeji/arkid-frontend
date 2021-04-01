import { TokenAPINode } from '@/arkfbp/nodes/tokenAPINode'
import getInitContent from '@/utils/get-init-content'
import { ITagPage } from '@/config/openapi'
import { runFlowByFile } from '@/arkfbp/index'

export class InitInputList extends TokenAPINode {
  async run() {
    const tempState = location.pathname === '/tenant' ? this.inputs.com.$store.state.tenant.tenantState : this.inputs.com.$store.state.admin.adminState
    const params = this.inputs.params
    const path = this.inputs.com.state.path

    // 给 第二层弹出框的 点击按钮添加 path 参数
    // 以便其在确认后将对应的值赋值给点击的DOM元素
    tempState.dialogs.selected.actions[0].action[0].params = {
      ...params,
      path: path
    }

    // 获取当前的数据内容  --  初始化List的右侧内容
    const nowInputListData = [...this.inputs.com.state.options]
    // 将当前数据显示在list的右侧已选列表中
    // list列表对应的内容也是键值对的形式，所以只需将此时的options直接赋值给list即可
    tempState.dialogs.selected.state.selected.list.items.length = 0
    tempState.dialogs.selected.state.selected.list.items = nowInputListData
    tempState.dialogs.selected.state.selected.header = {
      title: '已选数据列表' || ''
    }
    
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
            created: data.state.created,
            tree: data.state.tree
          }
          tempState.dialogs.selected.state.tablePage = null
          // tempState.dialogs.selected.state.treePage.tree.nodes.showCheckbox = params.multi	
          // tempState.dialogs.selected.state.treePage.tree.nodes.checkStrictly = true
          // tempState.dialogs.selected.state.treePage.tree.nodes.efaultCheckedKeys = [] 
          // tempState.dialogs.selected.state.treePage.tree.nodes.checkOnClickNode	= true
          tempState.dialogs.selected.state.treePage.tree.nodes.action.push({
            name: 'flows/list/clicked',
            params: {
              multi: params.multi,
              field: params.field,
              type: 'tree'
            }
          })
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
            created: data.state.created,
            table: data.state.table,
            pagination: data.state.pagination,
            card: data.state.card,
            // destroyed: 
          }
          tempState.dialogs.selected.state.treePage = null
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
        })
      }
    }
    // 最后，打开对话框
    tempState.dialogs.selected.visible = true
  }
}
