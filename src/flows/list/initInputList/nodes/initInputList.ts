import { FunctionNode } from 'arkfbp/lib/functionNode'
import getInitContent from '@/utils/get-init-content'
import { ITagPage } from '@/config/openapi'
import { runFlowByFile } from '@/arkfbp/index'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'

export class InitInputList extends FunctionNode {
  async run() {
    const state = this.inputs.client
    const params = this.inputs.com.state.data
    // 通过page字段信息获取list的初始化资源  --  初始化List的左侧内容
    let initContent = getInitContent(params.page) as ITagPage
    if (params.page === 'group') {
      initContent = initContent[0]
    }
    await runFlowByFile('flows/basePage', {
      initContent: initContent
    }).then((data) => {
      const tempState = data.state
      this.initDialogPage(state, tempState)
    })
    state.dialogs.selected.visible = true
  }

  initDialogPage(state: any, tempState: AdminComponentState) {
    const { params, flow, data } = this.getInitAttrs() 
    state.dialogs.selected.state = {
      type: tempState.type,
      state: {
        ...tempState.state,
        list: state.dialogs.selected.state.state.list
      }
    }
    state.actions.confirm = flow
    state.dialogs.selected.state.state.actions.clicked = [
      {
        name: 'flows/list/clicked',
        request: {
          multi: params.multi,
          field: params.field,
          type: tempState.type
        }
      }
    ]
    state.dialogs.selected.state.state.list.header = {
      title: '已选数据列表' || ''
    }
    state.dialogs.selected.state.state.list.data.length = 0
    state.dialogs.selected.state.state.list.data = data
    // switch
    switch (tempState.type) {
      case 'TablePage':
        this.initDialogTablePage(state, tempState, params)
        break
      case 'TreePage':
        this.initDialogTreePage(state, tempState)
    }
  }

  initDialogTreePage(state: any, tempState: AdminComponentState) {
    state.dialogs.selected.state.state.tree.action = 'clicked'
  }

  initDialogTablePage(state: any, tempState: AdminComponentState, params: any) {
    state.dialogs.selected.state.state.table.selection = {
      exist: params.multi,
      values: []
    }
    state.dialogs.selected.state.state.table.selectAction = 'clicked'
  }

  getInitAttrs() {
    const com = this.inputs.com
    const params = com.state.data
    const path = com.path
    const data = [...com.state.options]
    const flow = [
      {
        name: 'flows/list/confirm',
        path: path,
        request: { ...params }
      }
    ]
    return {
      params,
      data,
      flow
    }
  }
}
