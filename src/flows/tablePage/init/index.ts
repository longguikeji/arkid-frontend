import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { StartNode } from 'arkfbp/lib/startNode'
import { StopNode } from 'arkfbp/lib/stopNode'
import { InitTablePage } from './nodes/initTablePage'
import { InitList } from './nodes/initList'
import { InitCreate } from './nodes/initCreate'
import { InitUpdate } from './nodes/initUpdate'
import { InitDelete } from './nodes/initDelete'
import { InitSortable } from './nodes/initSortable'

export class Main extends Flow {
  createNodes() {
    return [
      {
        cls: StartNode,
        id: 'start',
        next: 'initTablePage'
      }, {
        cls: InitTablePage,
        id: 'initTablePage',
        next: 'initList'
      }, {
        cls: InitList,
        id: 'initList',
        next: 'initCreate'
      }, {
        cls: InitCreate,
        id: 'initCreate',
        next: 'initUpdate'
      }, {
        cls: InitUpdate,
        id: 'initUpdate',
        next: 'initDelete'
      }, {
        cls: InitDelete,
        id: 'initDelete',
        next: 'initSortable'
      }, {
        cls: InitSortable,
        id: 'initSortable',
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
