import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { StartNode } from 'arkfbp/lib/startNode'
import { StopNode } from 'arkfbp/lib/stopNode'
import { InitFormPage } from './nodes/initFormPage'
import { InitReadOnlyForm } from './nodes/initReadOnlyForm'
import { InitRequestForm } from './nodes/initRequestForm'

export class Main extends Flow {
  createNodes() {
    return [
      {
        cls: StartNode,
        id: 'start',
        next: '1'
      }, {
        cls: InitFormPage,
        id: '1',
        next: '2'
      }, {
        cls: InitReadOnlyForm,
        id: '2',
        next: '3'
      }, {
        cls: InitRequestForm,
        id: '3',
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
