import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { StartNode } from 'arkfbp/lib/startNode'
import { StopNode } from 'arkfbp/lib/stopNode'
import { FetchUrlNode } from './nodes/fetch'
import { UrlNode } from '@/arkfbp/nodes/urlNode'
import { Fetch } from '@/arkfbp/flows/fetch/nodes/fetch'
import { ClientResponseNode } from '@/arkfbp/nodes/clientResponseNode'

export class Main extends Flow {
  createNodes() {
    return [{
      cls: StartNode,
      id: 'start',
      next: 'fetch-url'
    }, {
      cls: FetchUrlNode,
      id: 'fetch-url',
      next: 'url'
    }, {
      cls: UrlNode,
      id: 'url',
      next: 'fetch'
    }, {
      cls: Fetch,
      id: 'fetch',
      next: 'client'
    }, {
      cls: ClientResponseNode,
      id: 'client',
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
