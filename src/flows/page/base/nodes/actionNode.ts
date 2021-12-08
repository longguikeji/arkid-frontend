import { FunctionNode } from 'arkfbp/lib/functionNode'
import OpenAPI, {
  ISchema,
  ITagPageAction,
  ITagPageMapping,
  ITagPageMultiAction,
  ITagUpdateOperation,
  ITagPageOperation,
} from '@/config/openapi'
import { IFlow } from '@/arkfbp'
import { BasePage } from './pageNode'
import { BasePageOptions } from '@/flows/initPage/nodes/initPage'
import { FormItemsState } from '@/admin/common/Form/FormState'
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
    const { init, local, global } = dep
    this._page = page
    this._temp = state[page].state
    this._type = state[page].type
    this._opts = options
    if (init) this.initPageCreatedAction(init)
    if (local) this.initPageButtonsAction(local)
    if (global) this.initPageButtonsAction(global)
    if (this._temp.filter) this.initPageFilterAction()
    return this.inputs
  }

  initPageCreatedAction(init: ITagPageAction) {
    const { path, method, next } = init
    switch (this._type) {
      case 'TablePage':
        this.initTablePageCreatedAction(path, method)
        break
      case 'FormPage':
        this.initFormPageCreatedAction(path, method)
        break
      case 'TreePage':
        this.initTreePageCreatedAction(path, method, next)
    }
  }

  initTablePageCreatedAction(path: string, method: string) {
    const props = this.getFetchActionPropsBySchema(path, method)
    if (!props) return
    const { _temp: state, _page: page } = this
    const { data, next, previous, pagination } = props
    const response = {
      'table.data': data,
      data: `${data}[0]`
    }
    const request = {}
    if (pagination) {
      response['pagination.total'] = pagination
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
    const actions = state.actions!
    actions.fetch = [
      {
        name: 'arkfbp/flows/fetch',
        url: path, method,
        response, request
      }
    ]
    if (page.indexOf('.') === -1 || this.inputs.state._cards_.indexOf(page) === -1) {
      actions.created.push('fetch')
    }
  }

  initFormPageCreatedAction(path: string, method: string) {
    const { _opts: options, _temp: state } = this
    const blank = method === 'get' ? false : true
    let { mapping } = getActionMapping(path, method, blank, true, options.readonly)
    mapping = Object.assign(mapping, { data: '' })
    state.actions!.created.push('fetch')
    if (method === 'get') {
      state.actions!.fetch = [
        {
          name: 'arkfbp/flows/fetch',
          url: path, method,
          response: Object.assign(mapping, { 'data': '' })
        }
      ]
    } else {
      state.actions!.fetch = [
        {
          name: 'arkfbp/flows/assign',
          response: mapping
        }
      ]
    }
  }

  initTreePageCreatedAction(path: string, method: string, next?: string) {
    const props = this.getFetchActionPropsBySchema(path, method)
    if (!props) return
    const state = this._temp
    const { data, pagination } = props
    const response = {
      'tree.data': data,
      data: `${data}[0]`
    }
    const request = {}
    state.pagination = undefined
    this.setImportButtonDisabledProp(response, props.data)
    const actions = state.actions!
    actions.created.push('fetch')
    actions.fetch = [
      {
        name: 'arkfbp/flows/tree',
        url: path, method,
        response, request
      }
    ]
    if (next) {
      actions.fetch.push(`${next}.fetch`)
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
          case 'node':
            this.initPageTreeNodeAction(action as ITagPageAction)
            break
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
          case 'item':
            this.addFormItemAction(action as ITagPageAction)
            break
          default:
            this.addDirectAction(action as ITagPageAction, key)
        }
      }
    }
  }

  initPageTreeNodeAction(node: ITagPageAction) {
    const { path, method, next } = node
    const state = this._temp
    state.tree!.action = 'node'
    const actions = state.actions!
    actions!.node = [
      {
        name: 'arkfbp/flows/node'
      }
    ]
    if (path && method) {
      actions!.node.push({
        name: 'arkfbp/flows/children',
        url: path, method
      })
    }
    if (next) {
      actions!.node.push(`${next}.fetch`)
    }
  }

  initPageFilterAction() {
    const state = this._temp
    const fetch = state.actions!.fetch[0] as IFlow
    if (!fetch.request) {
      fetch.request = {}
    }
    for (const key in state.filter!.items) {
      if (key === 'action') continue
      const mapping = `filter.items.${key}.state.value`
      fetch.request[key] = mapping
    }
  }

  addOpenPageAction(key: string) {
    const actionName = `open${upperFirst(camelCase(key))}Dialog`
    const state = this._temp
    state.actions![actionName] = [
      {
        name: 'arkfbp/flows/data'
      },
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
        name: 'arkfbp/flows/data'
      },
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
    const { path, method } = action
    const { _temp: state, _page: page } = this
    switch (method) {
      case 'delete':
      case 'get':
        state.actions![key] = [
          {
            name: 'arkfbp/flows/data'
          },
          {
            name: 'arkfbp/flows/update',
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
            name: 'arkfbp/flows/update',
            url: path, method,
            request: mapping, required
          },
          `${parent}.close${upperFirst(camelCase(key))}Dialog`,
          `${parent}.fetch`
        ]
    }
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

  addFormItemAction(action: ITagPageAction) {
    const { path, method } = action
    const items = this._temp.form?.items
    if (items) {
      this.addFormItemActionState(items, path, method)
    }
  }

  addFormItemActionState(items: FormItemsState, path: string, method: string, prefix: string = '') {
    const actions = this._temp.actions
    Object.keys(items).forEach(key => {
      const item = items[key]
      if (item.type === 'FormObjectItem') {
        const objectItems = item.state.items
        this.addFormItemActionState(objectItems, path, method, key)
      } else {
        item.state.action = key
        actions![key] = [
          {
            name: 'arkfbp/flows/update',
            url: path, method,
            request: {
              [prefix || key]: prefix ? `form.items.${prefix}.state.value` : `form.items.${key}.state.value`
            }
          },
          'fetch'
        ]
      }
    })
  }

  getFetchActionPropsBySchema(path: string, method: string) {
    const content = getContent(path, method)
    if (!content) return
    const type = Object.keys(content)[0]
    const responseSchema = content && content[type] && content[type].schema
    if (!responseSchema) return null
    let ref = responseSchema.$ref as string
    if (responseSchema.items) { ref = (responseSchema.items as ISchema).$ref as string }
    const res = OpenAPI.instance.getSchemaByRef(ref)
    const props = { data: '', pagination: '', next: '', previous: '' }
    if (res.properties) {
      const properties = res.properties
      const { count, next, previous, results, data, items } = properties
      props.pagination = count ? 'count' : ''
      props.next = next ? 'next' : ''
      props.previous = previous ? 'previous' : ''
      if (results) {
        props.data = 'results'
      } else if (data) {
        props.data = 'data'
      } else if (items) {
        props.data = 'items'
      } else {
        props.data = ''
      }
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