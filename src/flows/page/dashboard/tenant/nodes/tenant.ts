import { FunctionNode } from 'arkfbp/lib/functionNode'

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
              label: '新建租户',
              type: 'primary',
              size: 'mini',
              action: 'openCreateTenantDialog',
              icon: 'el-icon-plus'
            },
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
            page: 'switch'
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
        action: 'openSwitchDialog',
        actions: {
          created: [ 'fetch' ],
          fetch: [{
            name: 'flows/custom/tenant/fetch',
            url: init.path,
            method: init.method
          }],
          openSwitchDialog: [
            {
              name: 'arkfbp/flows/assign',
              response: {
                'dialogs.switch.visible': true
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
    state.switch = {
      type: 'Descriptions',
      state: {
        items: [],
        border: true,
        column: 3,

      }
    }
  }
}