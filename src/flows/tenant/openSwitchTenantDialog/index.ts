import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { StartNode } from 'arkfbp/lib/startNode'
import { StopNode } from 'arkfbp/lib/stopNode'
import { GetDialogValues } from '@/nodes/getDialogValues'
import { OpenSwitchTenantDialog } from './nodes/open'
export class Main extends Flow {
  createNodes() {
    return [{
      cls: StartNode,
      id: 'start',
      next: 'getDialogValues'
    }, {
      cls: GetDialogValues,
      id: 'getDialogValues',
      next: 'openSwitchTenantDialog'
    }, {
      cls: OpenSwitchTenantDialog,
      id: 'openSwitchTenantDialog',
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
