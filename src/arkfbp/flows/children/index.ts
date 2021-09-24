import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { StartNode } from 'arkfbp/lib/startNode'
import { StopNode } from 'arkfbp/lib/stopNode'
import { UrlNode } from '@/arkfbp/nodes/urlNode'
import { ChildrenNode } from './nodes/children'

export class Main extends Flow {
  createNodes() {
    return [{
      cls: StartNode,
      id: 'start',
      next: 'url'
    }, {
      cls: UrlNode,
      id: 'url',
      next: 'tree-children'
    }, {
      cls: ChildrenNode,
      id: 'tree-children',
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
