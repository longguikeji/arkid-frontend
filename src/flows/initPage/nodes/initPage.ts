import { FunctionNode } from 'arkfbp/lib/functionNode'
import { runFlowByFile } from '@/arkfbp/index'
import { ITagPage } from '@/config/openapi'

export class InitPage extends FunctionNode {
  async run() {
    const initContent = this.inputs.initContent
    const isMultiPage = Array.isArray(initContent)
    let state
    if (isMultiPage) {
      state = []
      for (let i = 0; i < initContent.length; i++) {
        const pageState = await this.initPage(initContent[i])
        state.push(pageState)
      }
    } else {
      state = await this.initPage(initContent)
    }
    return {
      state: state
    }
  }

  async initPage(initContent: ITagPage) {
    let pageState
    let initFileName = ''
    switch (initContent.type) {
      case 'table_page':
      case 'form_page':
      case 'tree_page':
        initFileName = 'flows/basePage'
        break
      case 'dashboard_page':
        initFileName = 'flows/dashboardPage/init'
        break
    }
    await runFlowByFile(initFileName, {
      initContent: initContent
    }).then(data => {
      pageState = data.state
    })
    return pageState
  }

}
