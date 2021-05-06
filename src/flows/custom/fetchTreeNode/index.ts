import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { StartNode } from 'arkfbp/lib/startNode'
import { StopNode } from 'arkfbp/lib/stopNode'
import { Fetch } from '@/arkfbp/flows/fetch/nodes/fetch'
import { ChangeTreeNode } from './nodes/changeTreeNode'

export class Main extends Flow {
  createNodes() {
    return [{
      cls: StartNode,
      id: 'start',
      next: 'fetch'
    }, {
      cls: Fetch,
      id: 'fetch',
      next: 'changeTreeNode'
    }, {
      cls: ChangeTreeNode,
      id: 'changeTreeNode',
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