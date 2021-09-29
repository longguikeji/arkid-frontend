import { FunctionNode } from 'arkfbp/lib/functionNode'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'

export class AddAction extends FunctionNode {
  async run() {
    const { state, page } = this.inputs
    const pageState: AdminComponentState = state[page]
    const saveConfig = {
      name: 'flows/custom/loginRegisterConfig/saveConfig'
    }
    pageState.state.actions.fetch?.push(saveConfig)

    // staged code for test and design ui
    state.$tabs = {
      value: 'login_register_extension_config',
      tabPosition: 'left',
      stretch: true,
      items: [
        {
          name: 'login_register_extension_config',
          label: '登录注册插件化配置'
        },
        {
          name: 'tenant_register_privacy_notice',
          label: '注册隐私声明配置'
        },
        {
          name: 'login_register_config',
          label: '其他登录注册配置',
        }
      ]
    }
  }
}
