import { FunctionNode } from 'arkfbp/lib/functionNode'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'
import { IFlow } from '@/arkfbp'

export class AddAction extends FunctionNode {
  async run() {
    const { state, page } = this.inputs
    const pageState: AdminComponentState = state[page]
    pageState.state.filter = {
      inline: true,
      size: 'mini',
      items: {
        device_type: {
          label: '设备类型',
          type: 'Input',
          isSetWidth: false,
          state: {
            value: ''
          }
        },
        system_version: {
          label: '操作系统及版本',
          type: 'Input',
          isSetWidth: false,
          state: {
            value: ''
          }
        },
        browser_version: {
          label: '浏览器及版本',
          type: 'Input',
          isSetWidth: false,
          state: {
            value: ''
          }
        },
        ip: {
          label: 'IP地址',
          type: 'Input',
          isSetWidth: false,
          state: {
            value: ''
          }
        },
        mac_address: {
          label: 'mac地址',
          type: 'Input',
          isSetWidth: false,
          state: {
            value: ''
          }
        },
        device_number: {
          label: '设备号',
          type: 'Input',
          isSetWidth: false,
          state: {
            value: ''
          }
        },
        device_id: {
          label: '设备编号',
          type: 'Input',
          isSetWidth: false,
          state: {
            value: ''
          }
        },
        // account_ids: {
        //   label: '用户账号ID',
        //   type: 'Input',
        //   isSetWidth: false,
        //   state: {
        //     value: ''
        //   }
        // },
        action: {
          type: 'Button',
          isSetWidth: false,
          state: {
            label: '搜索',
            type: 'primary',
            action: 'fetch'
          }
        }
      }
    }
    const fetchAction = pageState.state.actions!.fetch
    if (fetchAction) {
      fetchAction[0] = {
        ...(fetchAction[0] as IFlow),
        name: 'flows/custom/device/filter',
        request: {
          device_type: 'filter.items.device_type.state.value',
          system_version: 'filter.items.system_version.state.value',
          browser_version: 'filter.items.browser_version.state.value',
          ip: 'filter.items.ip.state.value',
          mac_address: 'filter.items.mac_address.state.value',
          device_number: 'filter.items.device_number.state.value',
          device_id: 'filter.items.device_id.state.value',
          ...fetchAction[0].request
        }
      }
    }
  }
}
