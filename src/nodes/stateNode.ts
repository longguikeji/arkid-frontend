import { FunctionNode } from 'arkfbp/lib/functionNode'
import getPageState, { getPreviousPageState, getBaseState } from '@/utils/get-page-state'
 
export class StateNode extends FunctionNode {

  getState(path: string = '') {
    return getPageState(path)
  }

  getPreviousState() {
    return getPreviousPageState()
  }

  getBaseState() {
    return getBaseState()
  }

}
