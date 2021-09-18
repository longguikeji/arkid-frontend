import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { StartNode } from 'arkfbp/lib/startNode'
import { StopNode } from 'arkfbp/lib/stopNode'
import { NextNode } from './nodes/next'

export class Main extends Flow {
  createNodes() {
    return [{
      cls: StartNode,
      id: 'start',
      next: 'next'
    }, {
      cls: NextNode,
      id: 'from',
      next: 'next'
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
