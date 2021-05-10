import { FunctionNode } from 'arkfbp/lib/functionNode'
import { getBaseState, getStateByComponentPath } from '@/utils/get-page-state'
 
export class StateNode extends FunctionNode {

  getBaseState() {
    return getBaseState()
  }

  getStateByComponentPath(path: string) {
    return getStateByComponentPath(path)
  }

}
