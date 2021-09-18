import { FunctionNode } from 'arkfbp/lib/functionNode'
import OpenAPI, {
  ISchema,
  ITagPageAction,
  ITagPageMapping,
  ITagPageMultiAction,
  ITagUpdateOperation,
  ITagPageOperation,
  ITagPage
} from '@/config/openapi'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'
import { BasePage } from './pageNode'
import { BasePageOptions } from '@/flows/initPage/nodes/initPage'
import { getContent } from '@/utils/schema'
import { getActionMapping } from '@/utils/generate-action'
import { upperFirst, camelCase } from 'lodash'

export class ActionNode extends FunctionNode {
  private _page: string = '' // 当前需要初始化state的页面名称
  private _temp: BasePage = {} // 当前页面临时state
  private _type: string = '' // 当前页面的类型
  private _opts: BasePageOptions = {}

  async run() {
    const { dep, state, page, options } = this.inputs
    const { init, local, global, node } = dep
    this._page = page
    this._temp = state[page].state
    this._type = state[page].type
    this._opts = options
    if (init) this.initPageCreatedAction(init)
    if (local) this.initPageButtonsAction(local)
    if (global) this.initPageButtonsAction(global)
    if (node) this.initPageTreeNodeAction(node)
    return this.inputs
  }

  initPageCreatedAction(init: ITagPageAction) {
    const { path, method, next, from } = init
    switch (this._type) {
      case 'TablePage':
        this.initTablePageCreatedAction(path, method, next, from)
        break
      case 'FormPage':
        this.initFormPageCreatedAction(path, method, next, from)
        break
      case 'TreePage':
        this.initTreePageCreatedAction(path, method, next, from)
    }
  }

  initTablePageCreatedAction(path: string, method: string, next?: string, from?: string) {
    const props = this.getFetchActionPropsBySchema(path, method)
    if (!props) return
    const state = this._temp
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
    } else {
      state.pagination = undefined
    }
    this.setImportButtonDisabledProp(response, props.data)
    // add created and fetch action
    if (from) {
      state.actions!.created = []
    } else {
      state.actions!.created.push('fetch')
    }
    state.actions!.fetch = [
      {
        name: 'arkfbp/flows/fetch',
        url: path, method,
        response, request
      }
    ]
  }

  initFormPageCreatedAction(path: string, method: string, next?: string, from?: string) {
    const { _opts: options, _temp: state } = this
    const blank = method === 'get' ? false : true
    let { mapping } = getActionMapping(path, method, blank, true, options.readonly)
    mapping = Object.assign(mapping, { data: '' })
    if (method === 'get') {
      state.actions!.created.push('fetch')
      state.actions!.fetch = [
        {
          name: 'arkfbp/flows/fetch',
          url: path, method,
          response: mapping
        }
      ]
    }
  }

  initTreePageCreatedAction(path: string, method: string, next?: string, from?: string) {
    const props = this.getFetchActionPropsBySchema(path, method)
    if (!props) return
    const state = this._temp
    const response = {
      'tree.data': props.data,
      data: props.data
    }
    this.setImportButtonDisabledProp(response, props.data)
    state.actions!.created.push('fetch')
    state.actions!.fetch = [
      {
        name: 'arkfbp/flows/tree',
        url: path, method,
        response
      }
    ]
    if (next) {
      Array.prototype.push.apply(state.actions!.fetch, [ { name: 'arkfbp/flows/next' }, `${next}.fetch` ])
    }
  }

  initPageButtonsAction(actions: ITagPageOperation) {
    for (const key in actions) {
      const action = actions[key]
      if ((action as ITagPageMapping).tag) {
        this.addOpenPageAction(key)
        this.addClosePageAction(key)
      } else {
        switch (key) {
          case 'export':
            this.addExportAction(action as ITagPageAction)
            break
          case 'import':
            this.addOpenPageAction(key)
            this.addClosePageAction(key)
            break
          case 'password':
            this.addPasswordAction(action as ITagPageAction | ITagUpdateOperation)
            this.addClosePageAction(key)
            break
          case 'sort':
            this.addSortAction(action as ITagPageMultiAction)
            break
          default:
            this.addDirectAction(action as ITagPageAction, key)
        }
      }
    }
  }

  initPageTreeNodeAction(node: ITagPageAction) {
    debugger
  }

  addOpenPageAction(key: string) {
    const actionName = `open${upperFirst(camelCase(key))}Dialog`
    const state = this._temp
    state.actions![actionName] = [
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

  addClosePageAction(key: string) {
    const actionName = `close${upperFirst(camelCase(key))}Dialog`
    const state = this._temp
    state.actions![actionName] = [
      {
        name: 'arkfbp/flows/assign',
        response: {
          [`dialogs.${key}.visible`]: false
        }
      }
    ]
  }

  addPasswordAction(action: ITagPageAction | ITagUpdateOperation) {
    const state = this._temp
    state.actions![`openPasswordDialog`] = [
      {
        name: 'arkfbp/flows/assign',
        response: {
          'dialogs.password.visible': true,
        }
      }
    ]
    if ((action as ITagUpdateOperation).read) {
      const { path, method } = (action as ITagUpdateOperation).read
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

  addExportAction(action: ITagPageAction) {
    const { path, method } = action
    const state = this._temp
    state.actions!['export'] = [
      {
        name: 'arkfbp/flows/export',
        url: path,
        method
      }
    ]
  }

  addDirectAction(action: ITagPageAction, key: string) {
    const { path, method, from, next } = action
    const { _temp: state, _page: page } = this
    switch (method) {
      case 'delete':
      case 'get':
        state.actions![key] = [
          {
            name: from ? 'arkfbp/flows/from' : 'arkfbp/flows/update',
            url: path, method
          }
        ]
        if (method === 'delete') state.actions![key].push('fetch')
        break
      default:
        const { required, mapping } = getActionMapping(path, method)
        const parent = page.split('.').slice(0, -1).join('.')
        state.actions![key] = [
          {
            name: 'arkfbp/flows/validate'
          },
          {
            name: from ? 'arkfbp/flows/from' : 'arkfbp/flows/update',
            url: path, method,
            request: mapping, required
          },
          `${parent}.close${upperFirst(camelCase(key))}Dialog`,
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

  addSortAction(action: ITagPageMultiAction) {
    const state = this._temp
    Object.keys(action).forEach((sortName) => {
      const url = action[sortName].path
      const method = action[sortName].method
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
    if (!content) return
    const type = Object.keys(content)[0]
    const responseSchema = content[type].schema
    let ref = responseSchema.$ref as string
    if (responseSchema.items) { ref = (responseSchema.items as ISchema).$ref as string }
    const res = OpenAPI.instance.getSchemaByRef(ref)
    const props = { data: '', pagination: '', next: '', previous: '' }
    if (res.properties) {
      const properties = res.properties
      props.pagination = properties.count ? 'count' : ''
      props.next = properties.next ? 'next' : ''
      props.previous = properties.previous ? 'previous' : ''
      props.data = properties.results ? 'results' : properties.data ? 'data' : ''
    }
    return props
  }

  setImportButtonDisabledProp(response: Object, refer: string) {
    const btns = this._temp.card?.buttons
    if (btns) {
      for (let i = 0, len = btns.length; i < len; i++) {
        const btn = btns[i]
        if (btn.name === 'export') {
          response[`card.buttons[${i}].disabled`] = refer ? `${refer}.length` : 'length'
          break
        }
      }
    }
  }
}