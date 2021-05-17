import { IOperation } from '@/config/openapi'
import ButtonState from '@/admin/common/Button/ButtonState'
import DialogState from '@/admin/common/Others/Dialog/DialogState'
import generateDialogForm from '@/utils/generate-dialog-form'
import getSchemaByContent from '@/utils/get-schema-by-content'
import OpenAPI from '@/config/openapi'
import whetherImportListDialog from '@/utils/list-dialog'
import { FlowConfig } from '@/arkfbp'
import { FormPage } from '@/admin/FormPage/FormPageState'
import FormItemState from '@/admin/common/Form/FormItem/FormItemState'

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
  actions?: Array<FlowConfig | string>
  buttons?: Array<ButtonState>
  showReadOnly?: boolean
  key?: string
}

export function generateDialogState(params: GenerateDialogStateParams): DialogState | undefined {
  const { initActionOperation, method, type, title, actions, buttons, showReadOnly, key } = params
  if (!initActionOperation || method === 'delete' || key === 'export') return undefined
  const isResponses = method.toLowerCase() === "get" ? true : false
  const content = isResponses ? initActionOperation.responses[200].content : initActionOperation.requestBody.content
  const schema = getSchemaByContent(content)
  const dialogState: DialogState = {}
  dialogState.title = title
  dialogState.visible = false
  dialogState.data = {}
  if (type === 'Upload') {
    dialogState.state = {
      type: 'Upload',
      state: {
        type: 'xlsx'
      }
    }
  } else {
    dialogState.state = {
      type: 'FormPage',
      state: generateDialogForm(schema, showReadOnly)
    }
  }
  dialogState.buttons = buttons
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
  const dialogButtons = [
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
    buttons: dialogButtons,
    showReadOnly,
    key
  }
  const dialogState = generateDialogState(dialogParams)
  if (dialogState) {
    tempState.dialogs![key] = dialogState as DialogState
    addDialogBtnActions(tempState, url, method, key, showReadOnly)
    const importListDialog = whetherImportListDialog(dialogState.state.state)
    if (importListDialog) {
      tempState.dialogs![key].state.state.dialogs = {
        selected: importListDialog
      }
      tempState.dialogs![key].state.state.actions = {
        initInputList: [
          {
            name: 'flows/list/initInputList'
          }
        ]
      }
    }  
  }
  return tempState
}

export function addDialogBtnActions(state: any, url: string, method: string, key: string, showReadOnly?: boolean) {
  const { isUpdatePage, dialogBtnPath, dialogBtnIsRequest, dialogBtnActionName } = getBaseAttributes(key)
  const target = 'dialogs.' + key + '.state.state.'
  const formState = state.dialogs[key].state.state
  let { requestMapping } = generateFormPageStateMapping(formState, target)
  if (key === 'import') {
    requestMapping = {
      data: 'dialogs.import.state.state.file'
    }
  }
  const dialogBtnFlows: (FlowConfig | string)[] = [
    {
      name: dialogBtnPath,
      url: url,
      method: method,
      request: dialogBtnIsRequest ? requestMapping : undefined
    },
    {
      name: 'arkfbp/flows/assign',
      response: {
        ['dialogs.' + key + '.visible']: false
      }
    }
  ]
  if (isUpdatePage) {
    dialogBtnFlows.push('fetch')
  }
  state.actions[dialogBtnActionName] = dialogBtnFlows
}

export function cardButton(state: any, url: string, method: string, key: string, showReadOnly?: boolean) {
  const { title, buttonType, pageBtnPath, pageBtnIsRequestion, pageBtnActionName } = getBaseAttributes(key)
  const cardButton = {
    label: title,
    action: pageBtnActionName,
    type: buttonType,
    disabled: key === 'export' ? true : undefined,
  }
  let response
  if (pageBtnIsRequestion && key !== 'import') {
    const target = 'dialogs.' + key + '.state.state.'
    let isEmpty = false
    if (key === 'create') { isEmpty = true }
    const formState = state.dialogs[key].state.state
    const { responseMapping } = generateFormPageStateMapping(formState, target, isEmpty)
    response = responseMapping
  }
  const cardButtonFlows = [
    {
      name: pageBtnPath,
      url: url,
      method: method,
      response: pageBtnIsRequestion ? {
        ['dialogs.' + key + '.visible']: true,
        ...response
      } : undefined
    }
  ]
  state.actions[pageBtnActionName] = cardButtonFlows
  return cardButton
}

export function itemButton(state: any, url: string, method: string, key: string, isText: boolean = false, showReadOnly?: boolean) {
  const { title, buttonType, pageBtnIsRequestion, pageBtnActionName } = getBaseAttributes(key)
  const itemButton = {
    label: title,
    type: isText ? 'text' : buttonType,
    action: pageBtnActionName
  }
  let response
  const target = 'dialogs.' + key + '.state.state.'
  if (pageBtnIsRequestion) {
    const formState = state.dialogs[key].state.state
    const { responseMapping } = generateFormPageStateMapping(formState, target)
    response = responseMapping
  }
  let itemButtonFlows: (FlowConfig | string)[]  = [
    {
      name: 'arkfbp/flows/fetch',
      url: url,
      method: method,
      response: pageBtnIsRequestion ? {
        ...response,
        ['dialogs.' + key + '.data']: ''
      } : undefined
    },
    {
      name: 'arkfbp/flows/assign',
      response: pageBtnIsRequestion ? {
        ['dialogs.' + key + '.visible']: true
      } : undefined
    }
  ]
  if (key === 'delete') { 
    itemButtonFlows = [
      {
        name: 'arkfbp/flows/update',
        url: url,
        method: method,
      },
      'fetch'
    ] 
  }
  state.actions[pageBtnActionName] = itemButtonFlows
  return itemButton
}

// 根据state生成state-mapping，prefix为空或'dialogs.create.state.state.'的形式的内容
export function generateFormPageStateMapping(state: FormPage, prefix: string = '', isEmpty?: boolean) {
  let responseMapping = {}
  let requestMapping = {}
  if (state.select && state.forms) {
    const selectPrefix = prefix + 'select.value'
    const valueKey = state.select.valueKey as string
    responseMapping[selectPrefix] = {
      value: isEmpty ? '' : valueKey
    }
    requestMapping[valueKey] = {
      value: isEmpty ? '' : selectPrefix
    }
    Object.keys(state.forms).forEach(key => {
      const formsItemPrefix = prefix + 'forms[' + key + '].items.'
      const items = state.forms![key].items
      if (items) {
        const { itemsResponseMapping, itemsRequestMapping } = generateFormItemStateMapping(items, formsItemPrefix, isEmpty)
        responseMapping[selectPrefix][key] = itemsResponseMapping
        requestMapping[valueKey][key] = itemsRequestMapping
      }
    })
  } else if (state.form) {
    prefix = prefix + 'form.items.'
    const items = state.form.items
    if (items) {
      const { itemsResponseMapping, itemsRequestMapping } = generateFormItemStateMapping(items, prefix, isEmpty)
      responseMapping = itemsResponseMapping
      requestMapping = itemsRequestMapping
    }
  }
  return {
    responseMapping,
    requestMapping
  }
}

export function generateFormItemStateMapping(items: { [prop:string]: FormItemState }, statePrefix: string = '', isEmpty?: boolean, resultPrefix?: string) {
  let itemsResponseMapping = {}
  let itemsRequestMapping = {}
  Object.keys(items).forEach(key => {
    if (items[key].state.items) {
      const deepClassPrefix = statePrefix + key + '.state.items.'
      const deepItems = items[key].state.items
      const deepResultPrefix = key + '.'
      const { itemsResponseMapping: childrenItemsResponseMapping, itemsRequestMapping: childrenItemsRequestMapping } = generateFormItemStateMapping(deepItems, deepClassPrefix, isEmpty, deepResultPrefix)
      itemsRequestMapping[key] = childrenItemsRequestMapping
      itemsResponseMapping = childrenItemsResponseMapping
    } else {
      const firstClassPrefix = statePrefix + key + '.state.value'
      const resultsKey = resultPrefix ? resultPrefix + key : key
      itemsResponseMapping[firstClassPrefix] = isEmpty ? '' : resultsKey
      itemsRequestMapping[key] = isEmpty ? '' : firstClassPrefix
    }
  })
  return {
    itemsResponseMapping,
    itemsRequestMapping
  }
}
