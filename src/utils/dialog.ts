import { IOperation } from '@/config/openapi'
import ButtonState from '@/admin/common/Button/ButtonState'
import DialogState from '@/admin/common/Others/Dialog/DialogState'
import generateDialogForm from '@/utils/generate-dialog-form'
import getSchemaByContent from '@/utils/get-schema-by-content'

// 参数说明:
// path: 获取Dialog元素的必备参数 -- 必须
// method: 方式 -- 必须
// type: 类型，由于Dialog可以展示任意组件，需要指明其类型，默认为“FormPage” - 非必须
// title: Dialog标题信息 -- 非必须
// actions: 操作，填入Dialog的按钮中 -- 非必须
// showReadOnly 是否需要展示 readOnly 的字段内容 - 非必须
export interface GenerateDialogStateParams {
  initActionOperation: IOperation
  method: string
  type?: string
  title?: string
  actions?: Array<ButtonState>
  showReadOnly?: boolean
}

export function generateDialogState(params: GenerateDialogStateParams): DialogState | undefined {
  const { initActionOperation, method, type, title, actions, showReadOnly } = params
  if (method === 'delete') return undefined
  if (!initActionOperation) return undefined
  const isResponses = method.toLowerCase() === "get" ? true : false
  const content = isResponses ? initActionOperation.responses[200].content : initActionOperation.requestBody.content
  const schema = getSchemaByContent(content)
  const actionDialogState: DialogState = {}
  actionDialogState.title = title
  actionDialogState.visible = false
  actionDialogState.data = {}
  actionDialogState.type = type || 'FormPage'
  actionDialogState.state = generateDialogForm(schema, showReadOnly)
  actionDialogState.actions = actions
  return actionDialogState
}
