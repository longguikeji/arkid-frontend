import { TokenAPINode } from '@/arkfbp/nodes/tokenAPINode'
import { runFlowByFile } from '@/arkfbp/index'
import getUrl from '@/utils/get-url'

export class DragTreeNode extends TokenAPINode {
  async run() {
    // drag flow
    // tree 节点的拖拽就相当于在某个节点中删除了某个节点，并在另外一个新的节点中添加了某个节点
    // 拖拽的情况有两种：
    // ① 同一级别下的更改顺序
    // ② 更换父节点，更换级别
    // to drag tree node
  }
}
