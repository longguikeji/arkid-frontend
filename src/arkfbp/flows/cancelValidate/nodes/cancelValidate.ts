import { FunctionNode } from 'arkfbp/lib/functionNode'
import { ValidateModule } from '@/store/modules/validate'

export class CancelValidate extends FunctionNode {
  async run() {
    ValidateModule.deleteAllItems()
  }
}
