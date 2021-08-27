import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { StartNode } from 'arkfbp/lib/startNode'
import { StopNode } from 'arkfbp/lib/stopNode'
import { UrlNode } from '@/arkfbp/nodes/urlNode'
import { Fetch } from './nodes/fetch'
import { Position } from './nodes/position'
import { ChangeState } from './nodes/changeState'

export class Main extends Flow {
  createNodes() {
    return [{
      cls: StartNode,
      id: 'start',
      next: 'url'
    }, {
      cls: UrlNode,
      id: 'url',
      next: 'fetch'
    }, {
      cls: Fetch,
      id: 'fetch',
      next: 'position'
    }, {
      cls: Position,
      id: 'position',
      next: 'change-dashboard-item'
    }, {
      cls: ChangeState,
      id: 'change-dashboard-item',
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