import { FunctionNode } from 'arkfbp/lib/functionNode'
import { upperFirst } from 'lodash'

export class Tenant extends FunctionNode {
  async run() {
    const { state, page, dep, options } = this.inputs
    const { init, global } = dep
    state[page] = {
      type: 'DashboardPage',
      state: {
        created: 'created',
        options: {
          disabled: true
        },
        card: {
          title: options.description,
          buttons: [
            {
              label: '退出登录',
              type: 'danger',
              size: 'mini',
              action: 'logout',
              icon: 'el-icon-right'
            }
          ]
        },
        dialogs: {
          switch: {
            visible: false,
            page: 'tenant.switch'
          }
        },
        pagination: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
          action: 'fetch'
        },
        items: [],
        data: null,
        actions: {
          created: [ 'fetch' ],
          fetch: [{
            name: 'flows/custom/tenant/fetch',
            url: init.path,
            method: init.method,
            request: {
              'page': 'pagination.currentPage',
              'page_size': 'pagination.pageSize'
            }
          }],
          switch: [
            {
              name: 'flows/custom/tenant/switch'
            }
          ],
          closeSwitchTenantDialog: [
            {
              name: 'arkfbp/flows/assign',
              response: {
                'dialogs.switch.visible': false
              }
            }
          ],
          logout: [
            {
              name: 'flows/common/logout'
            }
          ]
        }
      }
    }
    state['tenant.switch'] = {
      type: 'FormPage',
      state: {
        card: {
          title: '切换租户'
        },
        form: {
          items: {
            name: {
              type: 'Input',
              label: '租户名称',
              state: {
                value: '',
                readonly: true
              }
            },
            uuid: {
              type: 'Input',
              label: 'UUID',
              state: {
                value: '',
                readonly: true
              }
            },
            slug: {
              type: 'Input',
              label: 'Slug',
              state: {
                value: '',
                readonly: true
              }
            },
            use_slug: {
              type: 'SwitchForm',
              label: '是否使用Slug',
              state: {
                value: '',
                disabled: true
              }
            }
          }
        },
        buttons: [
          {
            action: 'tenant.closeSwitchTenantDialog',
            label: '取消'
          },
          {
            label: '进入该租户',
            type: 'primary',
            action: 'switchTenant'
          }
        ],
        actions: {
          switchTenant: [
            {
              name: 'flows/custom/tenant/switchTenant'
            }
          ]
        }
      }
    }
    if (global) {
      const pageState = state[page].state
      for (const key in global) {
        const { description, icon, tag } = global[key]
        state._pages_.push(tag)
        const k = upperFirst(key)
        pageState.card.buttons.unshift({
          label: description,
          type: 'primary',
          size: 'mini',
          action: `open${k}Dialog`,
          icon: icon
        })
        pageState.dialogs[key] = {
          visible: false,
          page: tag
        }
        pageState.actions[`open${k}Dialog`] = [
          {
            name: 'arkfbp/flows/assign',
            response: {
              [`dialogs.${key}.visible`]: true
            }
          }
        ]
        pageState.actions[`close${k}Dialog`] = [
          {
            name: 'arkfbp/flows/assign',
            response: {
              [`dialogs.${key}.visible`]: false
            }
          }
        ]
      }
    }
  }
}