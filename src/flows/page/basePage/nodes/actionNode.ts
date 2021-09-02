import { FunctionNode } from 'arkfbp/lib/functionNode'
import OpenAPI, { ISchema, ITagPage, ITagPageAction, ITagPageMapping, ITagPageMultiAction, ITagUpdateOperation } from '@/config/openapi'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'
import { getContent } from '@/utils/schema'
import { BasePage } from './pageNode'
import { getActionMapping } from '@/utils/generate-action'
import { firstToUpperCase } from '@/utils/common'

export class ActionNode extends FunctionNode {
  async run() {
    const { state, initContent, currentPage } = this.inputs
    this.initPageFetchAction(state[currentPage], initContent.init)
    this.initPageOperationAction(state[currentPage], initContent, currentPage)
    return this.inputs
  }

  initPageFetchAction(pageState: AdminComponentState, initAction: ITagPageAction) {
    const { path, method } = initAction
    const { state, type } = pageState
    switch (type) {
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

  initTablePageFetchAction(state: BasePage, path: string, method: string) {
    const props = this.getFetchActionPropsBySchema(path, method)
    const response = {
      'table.data': props.data,
      data: props.data
    }
    const request = {}
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

  initFormPageFetchAction(state: BasePage, path: string, method: string) {
    const response = true
    let blank = false, flowName
    if (method !== 'get') {
      blank = true
      flowName = 'arkfbp/flows/assign'
    }
    let { mapping } = getActionMapping(path, method, blank, response)
    mapping = Object.assign(mapping, { data: '' })
    this.addFetchAction(state, path, method, mapping, undefined, flowName)
  }

  initTreePageFetchAction(state: BasePage, path: string, method: string) {
    const props = this.getFetchActionPropsBySchema(path, method)
    const response = {
      'tree.data': props.data,
      data: props.data
    }
    this.setImportButtonDisabledProp(state, response, props.data)
    this.addFetchAction(state, path, method, response, undefined, 'arkfbp/flows/fetchTree')
  }

  addFetchAction(state: BasePage, path: string, method: string, response?: any, request?: any, flowName?: string) {
    state.actions!.created.push('fetch')
    state.actions!.fetch = [
      {
        name: flowName ? flowName : 'arkfbp/flows/fetch',
        url: path,
        method: method,
        response: response,
        request: request
      }
    ]
  }

  initPageOperationAction(pageState: AdminComponentState, initContent: ITagPage, currentPage: string) {
    const { global, local } = initContent
    const state = pageState.state
    const operations = Object.assign({}, global, local)
    for (const key in operations) {
      const operation = operations[key]
      if ((operation as ITagPageMapping).tag) {
        this.addOpenPageAction(state, key)
        this.addClosePageAction(state, key)
      } else {
        const { path, method } = operation as ITagPageAction
        switch (key) {
          case 'export':
            this.addExportAction(state, path, method)
            break
          case 'import':
            this.addOpenPageAction(state, key)
            this.addClosePageAction(state, key)
            break
          case 'password':
            this.addPasswordAction(state, (operation as ITagPageAction | ITagUpdateOperation))
            this.addClosePageAction(state, key)
            break
          case 'children':
            this.addChildrenAction(state, path, method)
            break
          case 'sort':
            this.addSortAction(state, operation as ITagPageMultiAction)
            break
          default:
            this.addDirectAction(state, path, method, key, currentPage)
        }
      }
    }
  }

  addOpenPageAction(state: BasePage, key: string) {
    state.actions![`open${firstToUpperCase(key)}Dialog`] = [
      {
        name: 'arkfbp/flows/cancelValidate' 
      },
      {
        name: 'arkfbp/flows/assign',
        response: {
          [`dialogs.${key}.visible`]: true
        }
      }
    ]
  }

  addClosePageAction(state: BasePage, key: string) {
    state.actions![`close${firstToUpperCase(key)}Dialog`] = [
      {
        name: 'arkfbp/flows/assign',
        response: {
          [`dialogs.${key}.visible`]: false
        }
      }
    ]
  }

  addPasswordAction(state: BasePage, operation: ITagPageAction | ITagUpdateOperation) {
    state.actions![`openPasswordDialog`] = [
      {
        name: 'arkfbp/flows/assign',
        response: {
          'dialogs.password.visible': true,
        }
      }
    ]
    if ((operation as ITagUpdateOperation).read) {
      const { path, method } = (operation as ITagUpdateOperation).read
      state.actions![`openPasswordDialog`].push(
        {
          name: 'arkfbp/flows/fetch',
          url: path,
          method,
          response: {
            'dialogs.password.state.state.data': ''
          }
        }
      )
    }
  }

  addExportAction(state: BasePage, path: string, method: string) {
    state.actions!['export'] = [
      {
        name: 'arkfbp/flows/export',
        url: path,
        method
      }
    ]
  }

  addDirectAction(state: BasePage, path: string, method: string, key: string, currentPage: string, parameters?: any) {
    let params = ''
    if (parameters) {
      Object.keys(parameters).forEach(key => {
        params += `${params}&${key}=${parameters[key]}`
      })
      params = `?${params.substring(1)}`
    }
    switch (method) {
      case 'delete':
        state.actions![key] = [
          {
            name: 'arkfbp/flows/update',
            url: `${path}${params}`,
            method
          },
          'fetch'
        ]
        break
      case 'get':
        state.actions![key] = [
          {
            name: 'arkfbp/flows/update',
            url: `${path}${params}`,
            method
          }
        ]
        break
      default:
        const { required, mapping } = getActionMapping(path, method)
        const parent = currentPage.split('.').slice(0, -1).join('.')
        state.actions![key] = [
          {
            name: 'arkfbp/flows/validate'
          },
          {
            name: 'arkfbp/flows/update',
            url: `${path}${params}`,
            method,
            request: mapping,
            required
          },
          `${parent}.close${firstToUpperCase(key)}Dialog`,
          `${parent}.fetch`
        ]
    }
  }

  addChildrenAction(state: BasePage, path: string, method: string) {
    state.tree!.action = 'fetchTreeNode'
    state.actions!.fetchTreeNode = [
      {
        name: "arkfbp/flows/fetchTreeNode",
        url: path,
        method: method
      }
    ]
  }

  addSortAction(state: BasePage, operation: ITagPageMultiAction) {
    Object.keys(operation).forEach((sortName) => {
      const url = operation[sortName].path
      const method = operation[sortName].method
      const actionName = 'sortBy' + sortName
      state.actions![actionName] = [
        {
          name: 'arkfbp/flows/sort',
          url: url,
          method: method,
          request: sortName === 'batch' ? {
            idps: {
              key: 'uuid',
              data: 'table.data'
            }
          } : undefined
        },
        'fetch'
      ]
    })
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

  setImportButtonDisabledProp(state: BasePage, response: Object, refer: string) {
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