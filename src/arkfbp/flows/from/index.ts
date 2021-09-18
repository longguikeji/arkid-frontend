import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { StartNode } from 'arkfbp/lib/startNode'
import { StopNode } from 'arkfbp/lib/stopNode'
import { FromNode } from './nodes/from'

export class Main extends Flow {
  createNodes() {
    return [{
      cls: StartNode,
      id: 'start',
      next: 'from'
    }, {
      cls: FromNode,
      id: 'from',
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
