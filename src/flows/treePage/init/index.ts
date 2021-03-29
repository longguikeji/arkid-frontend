import { Flow } from 'arkfbp/lib/flow'
import { Graph } from 'arkfbp/lib/graph'
import { StartNode } from 'arkfbp/lib/startNode'
import { StopNode } from 'arkfbp/lib/stopNode'
import { InitTreePage } from './nodes/initTreePage'
import { InitTree } from './nodes/initTree'
import { InitAddTreeNode } from './nodes/initAddTreeNode'
import { InitTreeNodeSlot } from './nodes/initTreeNodeSlot'
import { InitTablePage } from './nodes/initTablePage'
import { InitTableList } from './nodes/initTableList'

export class Main extends Flow {
  createNodes() {
    return [
      {
        cls: StartNode,
        id: 'start',
        next: '1'
      }, {
        cls: InitTreePage,
        id: '1',
        next: '2'
      }, {
        cls: InitTree,
        id: '2',
        next: '3'
      }, {
        cls: InitAddTreeNode,
        id: '3',
        next: '4'
      }, {
        cls: InitTreeNodeSlot,
        id: '4',
        next: '5'
      }, {
        cls: InitTablePage,
        id: '5',
        next: '6',
      }, {
        cls: InitTableList,
        id: '6',
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
