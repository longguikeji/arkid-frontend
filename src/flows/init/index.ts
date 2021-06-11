import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { StartNode } from 'arkfbp/lib/startNode'
import { StopNode } from 'arkfbp/lib/stopNode'
import { Slug } from './nodes/slug'
import { InterceptToken } from './nodes/interceptToken'
import { GetOriginUrl } from './nodes/getOriginUrl'
import { AfterLogin } from './nodes/afterLogin'

export class Main extends Flow {
  createNodes() {
    return [{
      cls: StartNode,
      id: 'start',
      next: 'slug'
    }, {
      cls: Slug,
      id: 'slug',
      next: 'interceptToken'
    }, {
      cls: InterceptToken,
      id: 'interceptToken',
      positiveNext: "getOriginUrl",
      negativeNext: "stop",
    }, {
      cls: GetOriginUrl,
      id: 'getOriginUrl',
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