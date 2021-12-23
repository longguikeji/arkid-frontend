import { FunctionNode } from 'arkfbp/lib/functionNode'
import { getSchemaByPath, getParamsByPath } from '@/utils/schema'

export class Extension extends FunctionNode {

  initFilter(path: string, method: string) {
    const schema = getSchemaByPath(path, method)
    const properties = schema.properties
    const params = getParamsByPath(path, method)
    const filter = {
      inline: true,
      size: 'mini',
      items: {}
    }
    if (params && properties) {
      for (const param of params) {
        const { in: i, name: n, description: d, schema: s } = param
        if (i === 'query' && properties[n]) {
          filter.items[n] = {
            type: s?.enum ? 'Select' : 'Input',
            label: d || n,
            isSetWidth: false,
            state: {
              value: '',
              placeholder: `请输入${d || n}`,
              clearable: true
            }
          }
          if (s && s.enum) {
            const state = filter.items[n].state
            state.options = []
            s.enum.forEach(e => {
              state.options.push({
                value: e,
                label: e
              })
            })
          }
        }
      }
      filter.items['action'] = {
        type: 'Button',
        isSetWidth: false,
        state: {
          label: '搜索',
          type: 'primary',
          action: 'toFilter',
          icon: 'el-icon-search',
          size: 'mini'
        }
      }
    }
    return filter
  }

  async run() {
    const { state, page, dep, options } = this.inputs
    const { init, local } = dep
    state[page] = {
      type: 'DashboardPage',
      state: {
        created: 'created',
        options: {
          disabled: true,
        },
        card: {
          title: options.description
        },
        filter: this.initFilter(init.path, init.method),
        items: [],
        dialogs: {},
        pagination: {
          total: 0,
          pageSize: 10,
          currentPage: 1,
          action: 'fetch'
        },
        actions: {
          created: [ 'fetch' ],
          fetch: [
            {
              name: 'flows/custom/extension/response',
              url: init.path,
              method: init.method,
              request: {
                page: 'pagination.currentPage',
                page_size: 'pagination.pageSize',
              }
            }
          ],
          toFilter: [
            {
              name: 'arkfbp/flows/resetPagination'
            },
            'fetch'
          ]
        }
      }
    }
    const filterItems = state[page].state.filter.items
    if (filterItems) {
      const fetchAction = state[page].state.actions.fetch[0]
      for (const key in filterItems) {
        if (key !== 'action') {
          fetchAction.request[key] = `filter.items.${key}.state.value`
        }
      }
    }
    if (local) {
      const { install: i, update: u, delete: d } = local
      const { actions, dialogs } = state[page].state
      actions.install = [
        {
          name: 'flows/custom/extension/install',
          url: i.path,
          method: i.method
        },
        'fetch'
      ]
      state._pages_.push(u.tag)
      dialogs.update = {
        visible: false,
        page: u.tag
      }
      actions.openUpdateDialog = [
        {
          name: 'arkfbp/flows/data'
        },
        {
          name: 'arkfbp/flows/assign',
          response: {
            'dialogs.update.visible': true
          }
        }
      ]
      actions.closeUpdateDialog = [
        {
          name: 'arkfbp/flows/assign',
          response: {
            'dialogs.update.visible': false
          }
        }
      ]
      actions.delete = [
        {
          name: 'arkfbp/flows/data'
        },
        {
          name: 'arkfbp/flows/update',
          url: d.path, method: d.method
        },
        'fetch',
        {
          name: 'arkfbp/flows/openapi'
        }
      ]
    }
  }
}