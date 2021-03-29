import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { StartNode } from 'arkfbp/lib/startNode'
import { StopNode } from 'arkfbp/lib/stopNode'
import { FetchTreeNodeChildren } from './nodes/fetchTreeNodeChildren'
import { FetchTableList } from './nodes/fetchTableList'

export class Main extends Flow {
  createNodes() {
    return [{
      cls: StartNode,
      id: 'start',
      next: '1'
    }, {
      cls: FetchTreeNodeChildren,
      id: '1',
      next: '2'
    }, {
      cls: FetchTableList,
      id: '2',
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
