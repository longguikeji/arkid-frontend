import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { StartNode } from 'arkfbp/lib/startNode'
import { StopNode } from 'arkfbp/lib/stopNode'
import { VerifyToken } from './nodes/verifyToken'
import { Init } from './nodes/init'

export class Main extends Flow {
  createNodes() {
    return [{
      cls: StartNode,
      id: 'start',
      next: 'verifyToken'
    }, {
      cls: VerifyToken,
      id: 'verifyToken',
      next: 'init'
    }, {
      cls: Init,
      id: 'init',
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