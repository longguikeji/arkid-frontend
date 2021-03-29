import { FunctionNode } from 'arkfbp/lib/functionNode'

export class Confirm extends FunctionNode {
  async run() {

    const tempState = location.pathname === '/tenant' ? this.inputs.com.$store.state.tenant.tenantState : this.inputs.com.$store.state.admin.adminState
    
    const data = tempState.dialogs.selected.state.selected.list.items
    const params = this.inputs.params
    const multi = params.multi
    const path = params.path.replace('admin.adminState.', '').replace('tenant.tenantState.', '')

    // 给 path 路径下面的元素赋值
    let reTempState = tempState
    const paths = path.split('.')
    for (const p of paths) {
      reTempState = reTempState[p]
    }
    
    // 确认时需要将之前的options去掉
    reTempState.options.length = 0

    // 如果data不为空，说明此时有可选项，否则将第一层的data赋值为null
    if (data.length > 0) {
      // 在这里可以进行单选还是多选的判断和逻辑处理
      if (multi) {
        reTempState.value = new Array()
        data.forEach((d => {
          reTempState.options.push(d)
          reTempState.value.push(d.value)
        }))
        // 赋值给多选内容
      } else {
        reTempState.options.push(data[0])
        reTempState.value = data[0].value
      }
    } else {
      reTempState.value = null
    }    
    
    // 关闭第二层弹出框
    tempState.dialogs.selected.visible = false
  }
}
