import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { StartNode } from 'arkfbp/lib/startNode'
import { StopNode } from 'arkfbp/lib/stopNode'
import { UrlNode } from '@/arkfbp/nodes/urlNode'
import { Fetch } from '@/arkfbp/flows/fetch/nodes/fetch'
import { Marketplace } from './nodes/marketplace'

export class Main extends Flow {
  createNodes() {
    return [
      {
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
        next: 'marketplace'
      }, {
        cls: Marketplace,
        id: 'marketplace',
        next: 'stop'
      }, {
        cls: StopNode,
        id: 'stop'
      }
    ]
  }

  createGraph() {
    const g = new Graph()
    g.nodes = this.createNodes()
    return g
  }
}
