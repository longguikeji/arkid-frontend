import { IOperation } from '@/config/openapi'
import ButtonState from '@/admin/common/Button/ButtonState'
import DialogState from '@/admin/common/Others/Dialog/DialogState'
import generateDialogForm from '@/utils/generate-dialog-form'
import getSchemaByContent from '@/utils/get-schema-by-content'
import OpenAPI from '@/config/openapi'
import whetherImportListDialog from '@/utils/list-dialog'

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
  key?: string
}

interface InitBaseAction {
  fetchUrl: string
  fetchMethod: string
}

export function generateDialogState(params: GenerateDialogStateParams): DialogState | undefined {
  const { initActionOperation, method, type, title, actions, showReadOnly, key } = params
  if (!initActionOperation || method === 'delete' || key === 'export') return undefined
  const isResponses = method.toLowerCase() === "get" ? true : false
  const content = isResponses ? initActionOperation.responses[200].content : initActionOperation.requestBody.content
  const schema = getSchemaByContent(content)
  const dialogState: DialogState = {}
  dialogState.title = title
  dialogState.visible = false
  dialogState.data = {}
  dialogState.type = type || 'FormPage'
  if (type === 'Upload') {
    dialogState.state = {
      type: 'xlsx'
    }
  } else {
    dialogState.state = generateDialogForm(schema, showReadOnly)
  }
  dialogState.actions = actions
  return dialogState
}


// 初始化按钮或弹出框时，对进行属性的操作，包括 title(标题)、buttonType(按钮类型)、dialogType(弹出框类型-默认为FormPage)
export function getBaseAttributes(key: string) {
  let title = '', dialogType = 'FormPage', buttonType = 'primary'
  let newKey = key.slice(0,1).toUpperCase() + key.slice(1).toLowerCase()
  switch (key) {
    case 'create':
      title = '创建'
      break
    case 'import':
      title = '导入'
      dialogType = 'Upload'
      break
    case 'export':
      title = '导出'
      break
    case 'update':
      title = '编辑'
      break
    case 'delete':
      title = '删除'
      buttonType = 'danger'
      break
    case 'retrieve':
      title = '查看'
      buttonType = 'info'
      break
  }
  return {
    title,
    dialogType,
    buttonType,
    newKey
  }
}


export function dialog(tempState: any, url: string, method: string, key: string, prefix: string, baseAction: InitBaseAction, showReadOnly: boolean = true) {
  const initActionOperation = OpenAPI.instance.getOperation(url, method)
  if (!initActionOperation) return tempState
  const { title, dialogType, buttonType } = getBaseAttributes(key)
  const dialogAction = [
    {
      label: initActionOperation.summary || title,
      type: buttonType,
      action: [
        {
          name: prefix + key,
          params: {
            url,
            method,
            ...baseAction
          }
        }
      ]
    }
  ]
  const dialogParams: GenerateDialogStateParams = {
    initActionOperation: initActionOperation,
    method,
    type: dialogType,
    title: initActionOperation.summary || title,
    actions: dialogAction,
    showReadOnly,
    key
  }
  const dialogState = generateDialogState(dialogParams)
  if (dialogState) {
    tempState.dialogs![key] = dialogState as DialogState
    const importListDialog = whetherImportListDialog(dialogState.state)
    if (importListDialog && !tempState.dialogs!.selected) {
      tempState.dialogs!.selected = importListDialog
    }
  }
  return tempState
}
