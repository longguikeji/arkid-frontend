import { FunctionNode } from 'arkfbp/lib/functionNode'
import { FlowModule } from '@/store/modules/flow'
import { ValidateModule } from '@/store/modules/validate'

export class Validate extends FunctionNode {
  async run() {
    const invalidValues = ValidateModule.invalidValues
    if (invalidValues.length > 0) {
      FlowModule.stopRunFlow()
    }
  }
}
