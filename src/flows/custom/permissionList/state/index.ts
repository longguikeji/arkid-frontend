import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { StartNode } from 'arkfbp/lib/startNode'
import { StopNode } from 'arkfbp/lib/stopNode'
import { ChangePermissionListStateNode } from './nodes/state'

export class Main extends Flow {
  createNodes() {
    return [
      {
        cls: StartNode,
        id: 'start',
        next: 'change-permission-list-state',
      },
      {
        cls: ChangePermissionListStateNode,
        id: 'change-permission-list-state',
        next: 'stop',
      },
      {
        cls: StopNode,
        id: 'stop',
      },
    ]
  }

  createGraph() {
    const g = new Graph()
    g.nodes = this.createNodes()
    return g
  }
}
