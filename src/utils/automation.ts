import { IOperation } from '@/config/openapi'
import ButtonState from '@/admin/common/Button/ButtonState'
import DialogState from '@/admin/common/Others/Dialog/DialogState'
import generateDialogForm from '@/utils/generate-dialog-form'
import getSchemaByContent from '@/utils/get-schema-by-content'
import OpenAPI from '@/config/openapi'
import whetherImportListDialog from '@/utils/list-dialog'
import { FlowConfig } from '@/flows'
import { getFormPageDialogRequestConfig } from '@/utils/get-dialog-params'

// 参数说明:
// initActionOperation: 获取Dialog元素的必备参数 -- 必须
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


// 初始化按钮或弹出框时，对进行属性的操作，
// 包括内容: 根据需求可以继续添加和修改
// title(标题)、buttonType(按钮类型)、dialogType(弹出框类型-默认为FormPage)
// isUpdatePage(操作之后是否涉及到更新当前页面的数据)、flowPath(执行流操作的文件所在位置)
export function getBaseAttributes(key: string) {
  let title = '', dialogType = 'FormPage', buttonType = 'primary'
  let dialogBtnPath = 'arkfbp/flows/update', dialogBtnIsRequest = true, dialogBtnActionName = ''
  let pageBtnPath = 'arkfbp/flows/assign', pageBtnIsRequestion = true, pageBtnActionName = ''
  let isUpdatePage = true
  switch (key) {
    case 'create':
      title = '创建'
      dialogBtnActionName = 'create'
      pageBtnActionName = 'openCreateDialog'
      break
    case 'import':
      title = '导入'
      dialogType = 'Upload'
      dialogBtnPath = 'arkfbp/flows/import'
      dialogBtnIsRequest = false
      dialogBtnActionName = 'import'
      pageBtnActionName = 'openImportDialog'
      break
    case 'export':
      title = '导出'
      isUpdatePage = false
      pageBtnPath = 'arkfbp/flows/export'
      pageBtnIsRequestion = false
      pageBtnActionName = 'export'
      break
    case 'update':
      title = '编辑'
      dialogBtnActionName = 'update'
      pageBtnActionName = 'openUpdateDialog'
      break
    case 'delete':
      title = '删除'
      buttonType = 'danger'
      pageBtnPath = 'arkfbp/flows/update'
      pageBtnIsRequestion = false
      pageBtnActionName = 'delete'
      break
    case 'retrieve':
      title = '查看'
      buttonType = 'info'
      isUpdatePage = false
      dialogBtnPath = 'arkfbp/flows/assign'
      dialogBtnIsRequest = false
      dialogBtnActionName = 'retrieve'
      pageBtnActionName = 'openRetrieveCreate'
      break
  }
  return {
    title,
    dialogType,
    buttonType,
    isUpdatePage,
    dialogBtnPath,
    dialogBtnIsRequest,
    dialogBtnActionName,
    pageBtnPath,
    pageBtnIsRequestion,
    pageBtnActionName
  }
}

export function generateDialog(tempState: any, url: string, method: string, key: string, showReadOnly: boolean = true) {
  const initActionOperation = OpenAPI.instance.getOperation(url, method)
  if (!initActionOperation) { return }
  const { title, dialogType, buttonType, dialogBtnActionName } = getBaseAttributes(key)
  // dialog-bottom-button-action
  const dialogAction = [
    {
      label: initActionOperation.summary || title,
      type: buttonType,
      action: dialogBtnActionName 
    }
  ]
  // start to generate state
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
    addDialogBtnActions(tempState, url, method, key)
    const importListDialog = whetherImportListDialog(dialogState.state)
    if (importListDialog && !tempState.dialogs!.selected) {
      tempState.dialogs!.selected = importListDialog
    }  
  }
  return tempState
}

export function addDialogBtnActions(state: any, url: string, method: string, key: string) {
  const { dialogType, isUpdatePage, dialogBtnPath, dialogBtnIsRequest, dialogBtnActionName } = getBaseAttributes(key)
  const dialog: DialogState = state.dialogs[key]
  if (dialogType === 'FormPage') {
    const prefix = 'dialogs.' + key
    const request = getFormPageDialogRequestConfig(dialog.state, prefix)
    const dialogBtnFlows: (FlowConfig | string)[] = [
      {
        name: dialogBtnPath,
        url: url,
        method: method,
        request: dialogBtnIsRequest ? request : undefined
      }
    ]
    if (isUpdatePage) {
      dialogBtnFlows.push('fetch')
    }
    state.actions[dialogBtnActionName] = dialogBtnFlows
  }
}


export function cardButton(state: any, url: string, method: string, key: string) {
  const { title, buttonType, pageBtnPath, pageBtnIsRequestion, pageBtnActionName } = getBaseAttributes(key)
  const cardButton = {
    label: title,
    action: pageBtnActionName,
    type: buttonType,
    disabled: key === 'export' ? true : undefined,
  }
  const cardButtonFlows = [
    {
      name: pageBtnPath,
      url: url,
      method: method,
      request: pageBtnIsRequestion ? {
        ['dialog.' + key + '.state.visible']: true
      } : undefined
    }
  ]
  state.card?.buttons?.push(cardButton)
  state.actions[pageBtnActionName] = cardButtonFlows
}

export function itemButton(state: any, url: string, method: string, key: string, isText: boolean = false) {
  const { title, buttonType, pageBtnPath, pageBtnIsRequestion, pageBtnActionName } = getBaseAttributes(key)
  const itemButton = {
    label: title,
    type: isText ? 'text' : buttonType,
    action: pageBtnActionName
  }
  const itemButtonFlows = [
    {
      name: pageBtnPath,
      url: url,
      method: method,
      request: pageBtnIsRequestion ? {
        ['dialogs.' + key + '.state.visible']: true
      } : undefined
    }
  ]
  state.actions[pageBtnActionName] = itemButtonFlows
  return itemButton
}
