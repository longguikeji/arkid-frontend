import { FunctionNode } from 'arkfbp/lib/functionNode'
import getPageState, { getPreviousPageState } from '@/utils/get-page-state'
 
export class StateNode extends FunctionNode {

  getState(path: string = '') {
    return getPageState(path)
  }

  getPreviousState() {
    return getPreviousPageState()
  }

}