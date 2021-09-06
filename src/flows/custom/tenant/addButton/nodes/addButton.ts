import { FunctionNode } from 'arkfbp/lib/functionNode'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'
import { getButtonIcon, getButtonDefaultLabel } from '@/utils/button'

export class AddButton extends FunctionNode {

  async run() {
    const { state, page } = this.inputs
    const pageState: AdminComponentState = state[page]
    // add logout button
    let buttons = pageState.state.card!.buttons
    if (!buttons) buttons = []
    buttons.push({
      type: 'danger',
      action: 'logout',
      icon: getButtonIcon('logout'),
      tip: {
        content: getButtonDefaultLabel('logout'),
      },
      circle: true
    })
    pageState.state.actions!.logout = [
      {
        name: 'flows/common/logout'
      }
    ]

    const columns = pageState.state.table?.columns
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
      scope: {
        type: 'ButtonArray',
        state: [
          {
            type: 'primary',
            action: 'openSwitchTenantDialog',
            icon: getButtonIcon('switch'),
            tip: {
              content: getButtonDefaultLabel('switch')
            },
            circle: true
          }
        ]
      }
    })
    pageState.state.actions!.openSwitchTenantDialog = [
      {
        name: 'arkfbp/flows/assign',
        response: {
          'dialogs.switch.visible': true
        }
      }
    ]

    const switchTenantPage = {
      type: 'FormPage',
      state: {
        name: 'tenant.switch',
        created: 'created',
        form: {
          items: {
            uuid: {
              type: 'InputNumber',
              label: 'UUID',
              prop: 'uuid',
              state: {
                value: '',
                readonly: true
              }
            },
            name: {
              type: 'Input',
              label: '名字',
              prop: 'name',
              state: {
                value: '',
                readonly: true
              }
            }
          }
        },
        buttons: [
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
    pageState.state.dialogs!.switch = {
      visible: false,
      page: 'tenant.switch'
    }
  }

}