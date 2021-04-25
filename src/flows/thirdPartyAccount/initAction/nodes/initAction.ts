import { AuthApiNode } from '@/nodes/authApiNode'
import FormPageState from '@/admin/FormPage/FormPageState'
import { FlowState } from '@/admin/base/BaseVue'

export class InitAction extends AuthApiNode {
  async run() {
    const state: FormPageState = this.inputs.state
    const initContent = this.inputs.initContent
    
    const fetchAction: FlowState = {
      name: 'flows/thirdPartyAccount/fetch',
      params: {
        fetchUrl: initContent.init.path,
        fetchMethod: initContent.init.method || 'GET',
      }
    }
    
    state.created?.splice(1, 1, fetchAction)
    return {
      state: state
    }
  }
}
