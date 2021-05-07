import { StateNode } from '@/nodes/stateNode'

export class Confirm extends StateNode {
  async run() {
    const tempState = this.inputs.client
    const data = tempState.list.data.items
    const params = this.inputs.params
    const multi = params.multi
    const path = this.inputs.path.replace('admin.adminState.', '').replace('tenant.tenantState.', '')
    const parentTempState = this.getState(path)
    const previousTempState = this.getPreviousState()
    
    // 确认时需要将之前的options去掉
    parentTempState.options.length = 0

    // 如果data不为空，说明此时有可选项，否则将第一层的data赋值为null
    if (data.length > 0) {
      // 在这里可以进行单选还是多选的判断和逻辑处理
      if (multi) {
        parentTempState.value = new Array()
        data.forEach((d => {
          parentTempState.options.push(d)
          parentTempState.value.push(d.value)
        }))
        // 赋值给多选内容
      } else {
        parentTempState.options.push(data[0])
        parentTempState.value = data[0].value
      }
    } else {
      parentTempState.value = null
    }    
    
    // 关闭页面弹出框
    previousTempState.dialogs.selected.visible = false
  }
}
