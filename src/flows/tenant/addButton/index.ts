import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { StartNode } from 'arkfbp/lib/startNode'
import { StopNode } from 'arkfbp/lib/stopNode'
import { AddLoyoutButton } from './nodes/addLogoutButton'
import { AddSwitchTenantButton } from './nodes/addSwitchTenantButton'

export class Main extends Flow {
  createNodes() {
    return [{
      cls: StartNode,
      id: 'start',
      next: 'addLoyoutButton'
    }, {
      cls: AddLoyoutButton,
      id: 'addLoyoutButton',
      next: 'addSwitchTenantButton'
    }, {
      cls: AddSwitchTenantButton,
      id: 'addSwitchTenantButton',
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
