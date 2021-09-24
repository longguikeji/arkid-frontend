import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { StartNode } from 'arkfbp/lib/startNode'
import { StopNode } from 'arkfbp/lib/stopNode'
import { UpdateUrlNode } from './nodes/update'
import { UrlNode } from '@/arkfbp/nodes/urlNode'
import { Update } from '@/arkfbp/flows/update/nodes/update'

export class Main extends Flow {
  createNodes() {
    return [{
      cls: StartNode,
      id: 'start',
      next: 'update-url'
    }, {
      cls: UpdateUrlNode,
      id: 'update-url',
      next: 'url'
    }, {
      cls: UrlNode,
      id: 'url',
      next: 'update'
    }, {
      cls: Update,
      id: 'update',
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
