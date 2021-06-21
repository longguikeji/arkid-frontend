import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { StartNode } from 'arkfbp/lib/startNode'
import { StopNode } from 'arkfbp/lib/stopNode'
import { GetOriginUrl } from './nodes/getOriginUrl'
import { Tenant } from './nodes/tenant'
import { InterceptToken } from './nodes/interceptToken'
import { AfterLogin } from './nodes/afterLogin'

export class Main extends Flow {
  createNodes() {
    return [{
      cls: StartNode,
      id: 'start',
      next: 'getOriginUrl'
    }, {
      cls: GetOriginUrl,
      id: 'getOriginUrl',
      next: 'tenant'
    }, {
      cls: Tenant,
      id: 'tenant',
      next: 'interceptToken'
    }, {
      cls: InterceptToken,
      id: 'interceptToken',
      positiveNext: "afterLogin",
      negativeNext: "stop",
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