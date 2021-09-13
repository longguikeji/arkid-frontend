import { APINode } from '@/arkfbp/nodes/apiNode'

export class DeleteListItemNode extends APINode {
  async run() {
    const { client: state, com } = this.inputs
    const listData = state.list.data
    if (listData?.length) {
      listData.splice(com.index, 1)
    }
    // can control table multiple and tree checked
    // ...
  }
}