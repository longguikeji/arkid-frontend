import { FunctionNode } from 'arkfbp/lib/functionNode'

export class AddButton extends FunctionNode {

  async run() {
    const { state, page } = this.inputs
    const pageState = state[page].state

    // add logout button
    const buttons = pageState.card.buttons
    buttons.push({
      type: 'danger',
      action: 'logout',
      label: '退出登录'
    })
    pageState.actions!.logout = [
      {
        name: 'flows/common/logout'
      }
    ]

    const columns = pageState.table.columns
    // fix icon column for display image
    for (let i = 0, l = columns.length; i < l; i++) {
      let column = columns[i]
      if (column.prop === 'icon') {
        columns[i] = {
          ...column,
          scope: {
            type: 'ImageBox',
            state: {
              value: ''
            }
          }
        }
        break
      }
    }
    // add switch tenant button (table every row)
    columns?.push({
      prop: 'actions',
      label: '操作',
      width: '150',
      fixed: 'right',
      scope: {
        type: 'ButtonArray',
        state: [
          {
            type: 'primary',
            action: 'openSwitchTenantDialog',
            label: '切换租户',
          }
        ]
      }
    })
    pageState.actions!.openSwitchTenantDialog = [
      {
        name: 'arkfbp/flows/assign',
        response: {
          'dialogs.switch.visible': true
        }
      }
    ]
    pageState.actions!.closeSwitchTenantDialog = [
      {
        name: 'arkfbp/flows/assign',
        response: {
          'dialogs.switch.visible': false
        }
      }
    ]

    const switchTenantPage = {
      type: 'FormPage',
      state: {
        created: 'created',
        card: {
          title: '切换租户'
        },
        descriptions: {
          items: {
            name: {
              label: '租户名称',
              value: ''
            },
            uuid: {
              label: 'UUID',
              value: ''
            }
          }
        },
        buttons: [
          {
            action: 'tenant.closeSwitchTenantDialog',
            label: '取消'
          },
          {
            label: '确定切换',
            type: 'primary',
            action: 'switchTenant'
          }
        ],
        actions: {
          switchTenant: [
            {
              name: 'flows/custom/tenant/switchTenant'
            }
          ],
          created: [ 'fetch' ],
          fetch: [
            {
              name: 'arkfbp/flows/fetch',
              url: '/api/v1/tenant/{id}/',
              method: 'get',
              response: {
                'descriptions.items.uuid.value': 'uuid',
                'descriptions.items.name.value': 'name',
              }
            }
          ]
        }
      }
    }
    state['tenant.switch'] = switchTenantPage
    pageState.dialogs!.switch = {
      visible: false,
      page: 'tenant.switch'
    }
  }

}