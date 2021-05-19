import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { StartNode } from 'arkfbp/lib/startNode'
import { StopNode } from 'arkfbp/lib/stopNode'
import { VerifyToken } from './nodes/verifyToken'
import { GetOriginUrl } from './nodes/getOriginUrl'
import { Slug } from './nodes/slug'
import { AfterLogin } from './nodes/afterLogin'

export class Main extends Flow {
  createNodes() {
    return [{
      cls: StartNode,
      id: 'start',
      next: 'verifyToken'
    }, {
      cls: VerifyToken,
      id: 'verifyToken',
      next: 'getOriginUrl'
    }, {
      cls: GetOriginUrl,
      id: 'getOriginUrl',
      next: 'slug'
    }, {
      cls: Slug,
      id: 'slug',
      next: 'afterLogin'
    }, {
      cls: AfterLogin,
      id: 'afterLogin',
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