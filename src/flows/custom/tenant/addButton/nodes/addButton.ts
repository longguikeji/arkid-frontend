import { FunctionNode } from 'arkfbp/lib/functionNode'
import { TenantModule } from '@/store/modules/tenant'

export class AddButton extends FunctionNode {

  async run() {
    const { state, page } = this.inputs
    const pageState = state[page].state
    const tenantSwitch = TenantModule.tenantSwitch

    // add logout button
    const buttons = pageState.card.buttons
    if (!tenantSwitch) {
      buttons.splice(0, 1)
    }
    buttons.push({
      type: 'danger',
      action: 'logout',
      label: '退出登录',
      icon: 'el-icon-right',
      size: 'mini'
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
    if (tenantSwitch) {
      columns?.push({
        prop: 'actions',
        label: '操作',
        width: '50',
        fixed: 'right',
        scope: {
          type: 'ButtonDropdown',
          state: [
            {
              type: 'primary',
              action: 'openSwitchTenantDialog',
              label: '切换租户',
              icon: 'el-icon-open'
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
                  'form.items.uuid.state.value': 'uuid',
                  'form.items.name.state.value': 'name',
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

}