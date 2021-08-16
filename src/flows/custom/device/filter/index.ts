import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { StartNode } from 'arkfbp/lib/startNode'
import { StopNode } from 'arkfbp/lib/stopNode'
import { Filter } from './nodes/filter'
import { ClientResponseNode } from '@/arkfbp/nodes/clientResponseNode'

export class Main extends Flow {
  createNodes() {
    return [
      {
        cls: StartNode,
        id: 'start',
        next: 'filter'
      }, {
        cls: Filter,
        id: 'filter',
        next: 'clientResponseNode'
      }, {
        cls: ClientResponseNode,
        id: 'clientResponseNode',
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
