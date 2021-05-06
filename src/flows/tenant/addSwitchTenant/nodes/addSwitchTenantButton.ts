import { StateNode } from '@/nodes/stateNode'
import DialogState from '@/admin/common/Others/Dialog/DialogState'
import TablePageState from '@/admin/TablePage/TablePageState'

export class AddSwitchTenantButton extends StateNode {
  async run() {
    const tempState: TablePageState = this.inputs.tempState
    
    // add tenant switch button
    const switchCurrentTenantButton = {
      label: '切换租户',
      type: 'primary',
      action: 'openSwitchTenantDialog'
    }
    tempState.table?.columns![tempState.table.columns!.length - 1]?.scope?.state?.push(switchCurrentTenantButton)

    // dialog
    const switchDialog: DialogState = {
      title: '切换租户',
      visible: false,
      data: {},
      type: 'FormPage',
      state: {
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
        }
      },
      actions: [
        {
          label: '确定切换',
          type: 'primary',
          action: [
            {
              name: 'flows/tenant/switchTenant',
              params: {
                router: this.inputs.router
              }
            }
          ]
        }
      ]
    }
    tempState.dialogs!.switch = switchDialog

    // add switch button flows to actions config
    tempState.actions!.openSwitchTenantDialog = [
      {
        name: 'arkfbp/flows/fetch',
        url: '/api/v1/tenant/{id}/',
        method: 'get',
        response: {
          'dialogs.switch.state.form.items.uuid.state.value': 'uuid',
          'dialogs.switch.state.form.items.name.state.value': 'name'
        }
      },
      {
        name: 'arkfbp/flows/assign',
        response: {
          'dialogs.switch.visible': true
        }
      }
    ]
    tempState.actions!.switchCurrentTenant = [
      {
        name: 'arkfbp/flows/jump',
        target: '/'
      },
      {
        name: 'arkfbp/flows/assign',
        response: {
          'dialogs.switch.visible': false
        }
      }
    ]
    
    return {
      state: tempState
    }
  }
}
