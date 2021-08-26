import { AuthApiNode } from "@/arkfbp/nodes/authApiNode"

export class DeleteListItemNode extends AuthApiNode {
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