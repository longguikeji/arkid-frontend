import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { StartNode } from 'arkfbp/lib/startNode'
import { StopNode } from 'arkfbp/lib/stopNode'
import { FetchMaketplace } from './nodes/fetch'
import { ChangeState } from '@/arkfbp/flows/fetch/nodes/changeState'

export class Main extends Flow {
  createNodes() {
    return [{
      cls: StartNode,
      id: 'start',
      next: 'fetchMaketplace'
    }, {
      cls: FetchMaketplace,
      id: 'fetchMaketplace',
      next: 'changeState'
    }, {
      cls: ChangeState,
      id: 'changeState',
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
