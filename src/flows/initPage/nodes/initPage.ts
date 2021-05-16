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
      initContent.forEach(async (page) => {
        const pageState = await this.initPage(page)
        state.push(pageState)
      })
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
        initFileName = 'flows/base/tablePage'
        break
      case 'form_page':
        initFileName = 'flows/base/formPage'
        break
      case 'tree_page':
        initFileName = 'flows/base/treePage'
        break
      case 'dashboard_page':
        initFileName = 'flows/base/dashboardPage/init'
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
