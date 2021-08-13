import { runWorkflowByClass } from 'arkfbp/lib/flow'
import { stateFilter } from '@/utils/flow'
import getUrl from '@/utils/url'
import { FlowModule } from '@/store/modules/flow'
import { isEmptyObject } from '@/utils/common'
import BaseVue from '@/admin/base/BaseVue'
import { getPageNameByPath } from '@/utils/state'

export interface IFlow {
  name: string
  url?: string
  method?: string
  request?: any
  response?: any
  target?: string // 配置jump时跳转的目标页面
  path?: string // 用于组件之间的指向
  required?: any // 用于验证
}

// actionName 操作名称，为了执行当前 actions 中的该动作
// pageName 页面名称，为了查找某个页面的state选项，以便执行其中的actions内容
// previous 上一个流操作的结果，有时可能在下一个流操作中使用到
export async function runFlowByActionName(com: BaseVue, actionName: string, pageName?: string, previous?: any) {
  if (actionName.includes('.')) {
    const index = actionName.lastIndexOf('.')
    pageName = actionName.substring(0, index)
    actionName = actionName.substring(index+1)
  }
  const state = getCurrentPageState(com, pageName)
  if (!state) return
  const { name: currentPage, actions } = state
  if (!actions) return
  const action: (IFlow | string)[] = actions[actionName]
  if (action?.length) {
    FlowModule.startRunFlow()
    for (let i = 0, l = action.length; i < l; i++) {
      if (!FlowModule.run) break
      const item = action[i]
      if (typeof item === 'string') {
        previous = await runFlowByActionName(com, item, pageName, previous)
      } else {
        previous = await runFlow(com, state, item as IFlow, currentPage, previous)
      }
    }
    return previous
  }
}

// 通过该函数去调用 runFlowByFile -- 解析 request 的参数信息
async function runFlow (com: any, state: any, flow: IFlow, currentPage: string, previous?: any) {
  const { name: filePath, ...args } = flow
  const data = com.state.selectedData || com.state.data
  if (data) FlowModule.addPageData({ page: currentPage, data })
  const { url, method, response, target, path, required } = args
  const inputs = {
    url: url ? getUrl(url, currentPage) : undefined,
    method: method?.toUpperCase(),
    params: {},
    client: state,
    clientServer: response,
    target: target,
    path: path,
    com: com,
    required: required,
    data,
    previous
  }
  // 对 request 请求参数进行解析处理
  if (args.request && !isEmptyObject(args.request)) {
    const mapping = stateMappingProxy(state, args.request)
    inputs.params = parseStateMapping(state, mapping)
  }
  return await runFlowByFile(filePath, inputs)
}

// 使用 arkfbp-javascript 执行配置中的流内容 
// arkfbp-javascript: https://github.com/longguikeji/arkfbp-javascript
export async function runFlowByFile(flowPath: string, inputs: any) {
  if (!flowPath) {
    return
  }
  if (/^(@\/)/.test(flowPath)) {
    flowPath = flowPath.slice(2)
  }
  const flow = await import(`@/${flowPath}`)
  const outputs = await runWorkflowByClass(flow.Main, inputs)
  return outputs
}

// 对Mapping进行一次二次处理
function stateMappingProxy(state: any, mappings: any) {
  let newMapping = {}
  const keys = Object.keys(mappings)
  for (const key of keys) {
    const mapping = mappings[key]
    const mappingType = typeof mapping
    if (mappingType === 'object' && mapping.value) {
      const valueMapping = mapping.value
      const selectValue = getStateByStringConfig(state, valueMapping)
      newMapping = Object.assign(newMapping, { [key]: valueMapping }, { ...mapping[selectValue] })
    } else {
      newMapping[key] = mapping
    }
  }
  return newMapping
}

// 对配置项中的 request 或者 response 进行配置解析
// 参数说明
// state: current page state
// mapping: request or response config
function parseStateMapping(state: any, mapping: any) {
  let params = {}
  Object.keys(mapping).forEach(key => {
    let tempState
    const item = mapping[key]
    if (typeof item === 'string') {
      tempState = getStateByStringConfig(state, item)
      if (tempState !== undefined && tempState !== null && tempState !== '') {
        params[key] = tempState
      }
    } else {
      params[key] = item
    }
  })
  return params
}

function getStateByStringConfig(state: any, str: string) {
  let tempState = state
  const strMapping = str.split('.')
  if (strMapping.length) {
    strMapping.forEach(sm => {
      if (sm.includes('[')) {
        const idx = sm.indexOf('[')
        const firstKey = sm.substring(0, idx)
        const secondKey = stateFilter(sm, tempState)
        tempState = tempState[firstKey][secondKey]
      } else {
        const value = tempState[sm]
        if (value || (!value && sm === 'value')) {
          tempState = value
        } else {
          tempState = str
        }
      }
    })
  }
  return tempState
}

function getCurrentPageState(com: BaseVue, name?: string) {
  let temp = com.$store.state
  const path = com.path
  const pageName = name || getPageNameByPath(path)
  const keys = path.split('.')[1].includes('[') ? path.replace(/[\[]/g, '.').replace(/[\]]/g, '').split('.') : path.split('.')
  temp = temp[keys[0]]
  temp = temp[keys[1]]
  return temp[pageName].state
}