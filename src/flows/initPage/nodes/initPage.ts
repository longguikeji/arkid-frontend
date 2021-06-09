import { FunctionNode } from 'arkfbp/lib/functionNode'
import { runFlowByFile } from '@/arkfbp/index'
import { ITagPage } from '@/config/openapi'

export class InitPage extends FunctionNode {
  async run() {
    const initContent = this.inputs.initContent
    const currentPage = this.inputs.currentPage
    const isMultiPage = Array.isArray(initContent)
    let state
    if (isMultiPage) {
      state = []
      for (let i = 0; i < initContent.length; i++) {
        const pageState = await this.initPage(initContent[i], currentPage)
        state.push(pageState)
      }
    } else {
      state = await this.initPage(initContent, currentPage)
    }
    return {
      state: state
    }
  }

  async initPage(initContent: ITagPage, currentPage?: string) {
    let state
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
    }).then(async (data) => {
      state = data.state
    })
    // special page
    if (currentPage === 'group') {
      await runFlowByFile('flows/group/changeFetch', {
        state: state,
        initContent: initContent
      }).then(data => {
        state = data.state
      })
    }
    if (currentPage === 'maketplace') {
      await runFlowByFile('flows/maketplace/initFilter', {
        state: state,
        initContent: initContent
      }).then(data => {
        state = data.state
      })
    }
    if (currentPage === 'third_party_account') {
      await runFlowByFile('flows/thirdPartyAccount/addUnbindButton', {
        state: state,
        initContent: initContent
      }).then(data => {
        state = data.state
      })
    }
    return state
  }

}
