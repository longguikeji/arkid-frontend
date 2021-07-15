import { FunctionNode } from 'arkfbp/lib/functionNode'
import OpenAPI, { ISchema, ITagPageAction, ITagPageOperation } from '@/config/openapi'
import { getContent } from '@/utils/schema'
import { ITagPage, ITagUpdateAction } from '@/config/openapi'
import { IPage } from './pageNode'
import { getActionMapping } from '@/utils/generate-action'
import { addGlobalExportAction, addGlobalPasswordAction, addDeleteAction, addOtherGlobalAction, addDialogAction, addLocalSortAction, addLocalChildrenAction, addOtherLocalAction } from '@/utils/state-action'

export class ActionNode extends FunctionNode {
  
  async run() {
    const { state: pageState, initContent } = this.inputs
    const { state, type } = pageState
    this.initPageFetchAction(state, type, initContent.init)
    this.initPageOperationAction(state, type, initContent)
    return this.inputs
  }

  initPageFetchAction(state: IPage, pageType: string, initAction: ITagPageAction) {
    const { path, method } = initAction
    switch (pageType) {
      case 'TablePage':
        this.initTablePageFetchAction(state, path, method)
        break
      case 'FormPage':
        this.initFormPageFetchAction(state, path, method)
        break
      case 'TreePage':
        this.initTreePageFetchAction(state, path, method)
    }
  }

  initTablePageFetchAction(state: IPage, path: string, method: string) {
    const props = this.getFetchActionPropsBySchema(path, method)
    const response = {},
          request = {}
    response['table.data'] = props.data
    if (props.pagination) {
      response['pagination.total'] = props.pagination
      request['page'] = 'pagination.currentPage'
      request['page_size'] = 'pagination.pageSize'
      state.pagination = {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        action: 'fetch'
      }
    }
    this.setImportButtonDisabledProp(state, response, props.data)
    this.addFetchAction(state, path, method, response, request)
  }

  initFormPageFetchAction(state: IPage, path: string, method: string) {
    const isResponse = true
    const target = ''
    const { mapping } = getActionMapping(path, method, target, isResponse)
    this.addFetchAction(state, path, method, mapping)
  }

  initTreePageFetchAction(state: IPage, path: string, method: string) {
    const props = this.getFetchActionPropsBySchema(path, method)
    const response = {}
    response['tree.data'] = props.data
    this.setImportButtonDisabledProp(state, response, props.data)
    this.addFetchAction(state, path, method, response, undefined, 'arkfbp/flows/fetchTree')
  }

  addFetchAction(state: IPage, path: string, method: string, response?: any, request?: any, flowName?: string) {
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

  initPageOperationAction(state: IPage, pageType: string, initContent: ITagPage) {
    const { page, item } = initContent
    if (page) {
      this.initGlobalOperationAction(state, page, pageType)
    }
    if (item) {
      this.initLocalOperationAction(state, item)
    }
  }

  initGlobalOperationAction(state: IPage, operations: ITagPageOperation, pageType: string) {
    for (const key in operations) {
      const operation = operations[key]
      if (typeof operation !== 'string') {
        let action = (operation as ITagUpdateAction).read || operation
        const { path, method } = action
        switch (key) {
          case 'export':
            addGlobalExportAction(state, path, method, key)
            break
          case 'password':
            addGlobalPasswordAction(state, key)
            break
          case 'delete':
            addDeleteAction(state, path, method, key)
            break
          default:
            addOtherGlobalAction(state, path, method, key, pageType)
        }
        action = (operation as ITagUpdateAction).write || operation
        addDialogAction(state, action.path, action.method, key)
      }
    }
  }

  initLocalOperationAction(state: IPage, operations: ITagPageOperation) {
    for (const key in operations) {
      const operation = operations[key]
      if (typeof operation !== 'string') {
        let action = (operation as ITagUpdateAction).read || operation
        const { path, method } = action
        switch (key) {
          case 'sort':
            addLocalSortAction(state, operation as ITagUpdateAction)
            break
          case 'children':
            addLocalChildrenAction(state, path, method)
            break
          case 'delete':
          case 'retry':
            addDeleteAction(state, path, method, key)
            break
          default:
            addOtherLocalAction(state, path, method, key)
            action = (operation as ITagUpdateAction).write || operation
            addDialogAction(state, action.path, action.method, key)
        }
      }
    }
  }

  getFetchActionPropsBySchema(path: string, method: string) {
    const content = getContent(path, method)
    const type = Object.keys(content)[0]
    const responseSchema = content[type].schema
    let ref = responseSchema.$ref as string
    if (responseSchema.items) { ref = (responseSchema.items as ISchema).$ref as string }
    const res = OpenAPI.instance.getSchemaByRef(ref)
    const props = { data: '', pagination: '' }
    if (res.properties) {
      const properties = res.properties
      props.pagination = properties.count ? 'count' : ''
      props.data = properties.results ? 'results' : properties.data ? 'data' : ''
    }
    return props
  }

  setImportButtonDisabledProp(state: IPage, response: Object, refer: string) {
    const btns = state.card?.buttons
    if (btns) {
      for (let i = 0, len = btns.length; i < len; i++) {
        const btn = btns[i]
        if (btn.label === '导出' || btn.label === 'export') {
          response[`card.buttons[${i}].disabled`] = refer ? `${refer}.length` : 'length'
          break
        }
      }
    }
  }
}