import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { StartNode } from 'arkfbp/lib/startNode'
import { StopNode } from 'arkfbp/lib/stopNode'
import { Entrance } from './nodes/entrance'
import { TenantNode } from './nodes/tenant'
import { TokenNode } from './nodes/token'
import { OpenapiNode } from '@/arkfbp/flows/openapi/nodes/openapi'
import { ConfigNode } from './nodes/config'
import { DeviceNode } from './nodes/device'

export class Main extends Flow {
  createNodes() {
    return [{
      cls: StartNode,
      id: 'start',
      next: 'entrance'
    }, {
      cls: Entrance,
      id: 'entrance',
      next: 'tenant'
    }, {
      cls: TenantNode,
      id: 'tenant',
      next: 'token'
    }, {
      cls: TokenNode,
      id: 'token',
      positiveNext: "openapi",
      negativeNext: "stop",
    }, {
      cls: OpenapiNode,
      id: 'openapi',
      next: 'config'
    }, {
      cls: ConfigNode,
      id: 'config',
      next: 'device'
    }, {
      cls: DeviceNode,
      id: 'device',
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