import { FunctionNode } from 'arkfbp/lib/functionNode'
import { ISchema } from '@/config/openapi'
import { getContent } from '@/utils/schema'
import { getFetchAttrs } from '@/utils/table'
import { ITagPage, ITagInitUpdateAction } from '@/config/openapi'
import { BasePage, IPage } from './pageNode'
import { addDialogAction, addItemAction, addCardAction, addChildrenAction, addSortAction } from '@/utils/dialog'
import { getActionMapping } from '@/utils/generate-action'
import { getImportBtnMapping } from '@/utils/button'

export class ActionNode extends FunctionNode {
  
  async run() {
    const { state, initContent } = this.inputs
    this.initPageFetchAction(state, initContent.init?.path, initContent.init?.method)
    this.initPageOperationAction(state, initContent)
    return this.inputs
  }

  initPageFetchAction(pageState: BasePage, path: string, method: string) {
    const content = getContent(path, method)
    const { type, state } = pageState
    if (type === 'TablePage') {
      this.initTablePageFetchAction(state, path, method, content)
    } 
    if (type === 'FormPage'){
      this.initFormPageFetchAction(state, path, method)
    }
    if (type === 'TreePage'){
      this.initTreePageFetchAction(state, path, method, content)
    }
  }

  initTablePageFetchAction(state: IPage, path: string, method: string, content: { [contentType: string]: {schema: ISchema} }) {
    const attrs = getFetchAttrs(content)
    const response = {},
          request = {}
    response['table.data'] = attrs.data
    if (attrs.pagination) {
      response['pagination.total'] = attrs.pagination
      request['page'] = 'pagination.currentPage'
      request['page_size'] = 'pagination.pageSize'
      state.pagination = {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        action: 'fetch'
      }
    }
    const importMapping = getImportBtnMapping(state)
    if (importMapping !== '') {
      response[importMapping] = `${attrs.data}.length`
    }
    this.initFetchAction(state, path, method, response, request)
  }

  initFormPageFetchAction(state: IPage, path: string, method: string) {
    const isResponse = true
    const target = ''
    const { mapping } = getActionMapping(path, method, target, isResponse)
    this.initFetchAction(state, path, method, mapping)
  }

  initTreePageFetchAction(state: IPage, path: string, method: string, content: { [contentType: string]: {schema: ISchema} }) {
    const attrs = getFetchAttrs(content)
    const response = {}
    response['tree.data'] = attrs.data
    const importMapping = getImportBtnMapping(state)
    if (importMapping !== '') {
      response[importMapping] = `${attrs.data}.length`
    }
    this.initFetchAction(state, path, method, response, undefined, 'arkfbp/flows/fetchTree')
  }

  initFetchAction(state: IPage, path: string, method: string, response?: any, request?: any, flowName?: string) {
    state.created = 'created'
    if (!state.actions) state.actions = {}
    state.actions!.created.push('fetch')
    state.actions.fetch = [
      {
        name: flowName ? flowName : 'arkfbp/flows/fetch',
        url: path,
        method: method,
        response: response,
        request: request
      }
    ]
  }

  initPageOperationAction(pageState: BasePage, initContent: ITagPage) {
    const { state } = pageState
    const { page, item } = initContent
    if (page) {
      for (const key in page) {
        const gItem = page[key]
        let action = (gItem as ITagInitUpdateAction).read || gItem
        addCardAction(state, action.path, action.method, key)
        action = (gItem as ITagInitUpdateAction).write || gItem
        addDialogAction(state, action.path, action.method, key)
      }
    }
    if (item) {
      for (const key in item) {
        const pItem = item[key]
        if (typeof pItem === 'string') continue
        let action = (pItem as ITagInitUpdateAction).read || pItem
        switch (key) {
          case 'sort':
            addSortAction(state, action)
            break
          case 'children':
            addChildrenAction(state, action.path, action.method)
            break
          default:
            addItemAction(state, action.path, action.method, key)
            action = (pItem as ITagInitUpdateAction).write || pItem
            addDialogAction(state, action.path, action.method, key)
        }
      }
    }
  }

}