import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { StartNode } from 'arkfbp/lib/startNode'
import { StopNode } from 'arkfbp/lib/stopNode'
import { InitPage } from './nodes/initPage'
import { InitTable } from './nodes/initTable'
import { InitSortable } from './nodes/initSortable'
import { InitAction } from './nodes/initAction'

export class Main extends Flow {
  createNodes() {
    return [
      {
        cls: StartNode,
        id: 'start',
        next: 'initPage'
      }, {
        cls: InitPage,
        id: 'initPage',
        next: 'initTable'
      }, {
        cls: InitTable,
        id: 'initTable',
        next: 'initSortable'
      }, {
        cls: InitSortable,
        id: 'initSortable',
        next: 'initAction'
      }, {
        cls: InitAction,
        id: 'initAction',
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