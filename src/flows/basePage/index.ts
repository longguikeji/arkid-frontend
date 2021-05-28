import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { StartNode } from 'arkfbp/lib/startNode'
import { StopNode } from 'arkfbp/lib/stopNode'
import { PageNode } from './nodes/pageNode'
import { StateNode } from './nodes/stateNode'
import { ActionNode } from './nodes/actionNode'

export class Main extends Flow {
  createNodes() {
    return [{
      cls: StartNode,
      id: 'start',
      next: 'pageNode'
    }, {
      cls: PageNode,
      id: 'pageNode',
      next: 'stateNode'
    }, {
      cls: StateNode,
      id: 'stateNode',
      next: 'actionNode'
    }, {
      cls: ActionNode,
      id: 'actionNode',
      next: 'stop'
    }, {
      cls: StopNode,
      id: 'stop',
      x: 455,
      y: 70
    }]
  }

  createGraph() {
    const g = new Graph()
    g.nodes = this.createNodes()
    return g
  }
}