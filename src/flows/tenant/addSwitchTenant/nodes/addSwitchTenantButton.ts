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
    const columns = tempState.table?.columns
    if (columns) {
      columns[columns.length - 1].scope?.state?.push(switchCurrentTenantButton)
    }

    // dialog
    const switchDialog: DialogState = {
      title: '切换租户',
      visible: false,
      data: {},
      state: {
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
        }
      },
      buttons: [
        {
          label: '确定切换',
          type: 'primary',
          action: 'switchTenant'
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
          'dialogs.switch.state.state.form.items.uuid.state.value': 'uuid',
          'dialogs.switch.state.state.form.items.name.state.value': 'name',
          'dialogs.switch.data': ''
        }
      },
      {
        name: 'arkfbp/flows/assign',
        response: {
          'dialogs.switch.visible': true
        }
      }
    ]
    tempState.actions!.switchTenant = [
      {
        name: 'flows/tenant/switchTenant',
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
