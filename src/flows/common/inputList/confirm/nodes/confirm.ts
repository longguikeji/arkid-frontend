import { FunctionNode } from 'arkfbp/lib/functionNode'

export class Confirm extends FunctionNode {
  async run() {
    const { client: state, params, path, com } = this.inputs
    const data = state.list.data
    const parentState = com.getAnyStateByPath(path)
    parentState.options.length = 0
    if (data.length > 0) {
      // 在这里可以进行单选还是多选的判断和逻辑处理
      if (params.multiple) {
        parentState.value = new Array()
        data.forEach((d => {
          parentState.options.push(d)
          parentState.value.push(d.value)
        }))
        // 赋值给多选内容
      } else {
        parentState.options.push(data[0])
        parentState.value = data[0].value
      }
    } else {
      parentState.value = null
    }
    return this.inputs
  }
}
