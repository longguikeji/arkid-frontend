import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { StartNode } from 'arkfbp/lib/startNode'
import { StopNode } from 'arkfbp/lib/stopNode'
import { InitPage } from '@/nodes/pageNode'
import { StateNode } from '@/nodes/stateNode'
import { InitSortable } from './nodes/initSortable'
// import { InitAction } from './nodes/initAction'
import { ActionNode } from '@/nodes/actionNode'

export class Main extends Flow {
  createNodes() {
    return [
      {
        cls: StartNode,
        id: 'start',
        next: 'initPage'
      }, {
        cls: InitPage,
        id: 'initPage',
        next: 'stateNode'
      }, {
        cls: StateNode,
        id: 'stateNode',
        next: 'initSortable'
      }, {
        cls: InitSortable,
        id: 'initSortable',
        next: 'actionNode'
      }, {
        cls: ActionNode,
        id: 'actionNode',
        next: 'stop'
      }, {
        cls: StopNode,
        id: 'stop'
      }
    ]
  }

  createGraph() {
    const g = new Graph()
    g.nodes = this.createNodes()
    return g
  }
}
