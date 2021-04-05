import { FunctionNode } from 'arkfbp/lib/functionNode'
import DialogState from '@/admin/common/Others/Dialog/DialogState'

export class AddSwitchTenantButton extends FunctionNode {
  async run() {
    const tempState = this.inputs.tempState
    // button
    const switchTenantAction = {
      label: '切换租户',
      type: 'primary',
      action: [
        {
          name: 'flows/tenant/openSwitchTenantDialog',
          params: {
            updateUrl: '/api/v1/tenant/{id}/',
            updateMethod: 'get'
          }
        }
      ]
    }
    tempState.table?.columns[tempState.table.columns.length - 1]?.scope?.state?.push(switchTenantAction)
    // dialog
    const switchDialog: DialogState = {
      title: '切换租户',
      visible: false,
      data: {},
      type: 'FormPage',
      state: {
        form: {
          items: {
            id: {
              type: 'InputNumber',
              label: 'ID',
              prop: 'id',
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
    tempState.dialogs.switch = switchDialog
    return {
      state: tempState
    }
  }
}
