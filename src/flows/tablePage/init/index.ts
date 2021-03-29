import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { StartNode } from 'arkfbp/lib/startNode'
import { StopNode } from 'arkfbp/lib/stopNode'
import { InitTablePage } from './nodes/initTablePage'
import { InitList } from './nodes/initList'
import { InitCreate } from './nodes/initCreate'
import { InitUpdate } from './nodes/initUpdate'
import { InitDelete } from './nodes/initDelete'

export class Main extends Flow {
  createNodes() {
    return [
      {
        cls: StartNode,
        id: 'start',
        next: 'InitTablePage'
      }, {
        cls: InitTablePage,
        id: 'InitTablePage',
        next: 'InitList'
      }, {
        cls: InitList,
        id: 'InitList',
        next: 'InitCreate'
      }, {
        cls: InitCreate,
        id: 'InitCreate',
        next: 'InitUpdate'
      }, {
        cls: InitUpdate,
        id: 'InitUpdate',
        next: 'InitDelete'
      }, {
        cls: InitDelete,
        id: 'InitDelete',
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
