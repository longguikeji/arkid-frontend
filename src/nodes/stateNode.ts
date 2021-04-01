import { FunctionNode } from 'arkfbp/lib/functionNode'
import getNodeState from '@/utils/get-node-state'
 
export class FunctionStateNode extends FunctionNode {

  getState(path: string = '') {
    return getNodeState(path)
  }

}