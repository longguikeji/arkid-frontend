import { FunctionNode } from 'arkfbp/lib/functionNode'
import { GlobalValueModule } from '@/store/modules/global-value'

export class SaveConfig extends FunctionNode {
  async run() {
    const data = this.inputs.com.state.data
    GlobalValueModule.setGlobalConfig(data.data)
  }
}