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
      next: 'fetchTreeNodeChildren'
    }, {
      cls: FetchTreeNodeChildren,
      id: 'fetchTreeNodeChildren',
      next: 'fetchTableList'
    }, {
      cls: FetchTableList,
      id: 'fetchTableList',
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
