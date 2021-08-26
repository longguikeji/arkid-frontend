import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { StartNode } from 'arkfbp/lib/startNode'
import { StopNode } from 'arkfbp/lib/stopNode'
import { Validate } from './nodes/validate'

export class Main extends Flow {
  createNodes() {
    return [{
      cls: StartNode,
      id: 'start',
      next: 'validate'
    }, {
      cls: Validate,
      id: 'validate',
      next: 'stop'
    }, {
      cls: StopNode,
      id: 'stop'
    }]
  }

  createGraph() {
    const g = new Graph()
    g.nodes = this.createNodes()
    return g
  }
}
