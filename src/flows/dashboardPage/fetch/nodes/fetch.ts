import { AuthApiNode } from '@/nodes/authApiNode'
import getUrl from '@/utils/url'
import DashboardPageState from '@/admin/DashboardPage/DashboardPageState'

export class Fetch extends AuthApiNode {
  async run() {
    const tempState: DashboardPageState = this.getState()

    this.url = getUrl(this.inputs.params.fetchUrl)
    this.method = (this.inputs.params.fetchMethod as string).toUpperCase() || 'GET'

    this.$state.commit((state: any) => {
      state.client = tempState
    })

    const outputs = await super.run()
    
    return {
      data: outputs,
      com: this.inputs.com
    }
  }
}
