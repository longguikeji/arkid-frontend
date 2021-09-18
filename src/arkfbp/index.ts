import { runWorkflowByClass } from 'arkfbp/lib/flow'
import { stateFilter } from '@/utils/flow'
import { FlowModule } from '@/store/modules/flow'
import { isEmptyObject } from '@/utils/common'
import BaseVue from '@/admin/base/BaseVue'

export interface IFlow {
  name: string
  url?: string
  method?: string
  request?: any
  response?: any
  target?: string // 配置jump时跳转的目标页面
  path?: string // 用于组件之间的指向
  required?: any // 用于验证
  from?: string
  next?: string
}

// actionName 操作名称，为了执行当前 actions 中的该动作
// pageName 页面名称，为了查找某个页面的state选项，以便执行其中的actions内容
// previous 上一个流操作的结果，有时可能在下一个流操作中使用到
export async function runFlowByActionName(com: BaseVue, actionName: string, previous?: any) {
  let page = com.page
  if (actionName.includes('.')) {
    const index = actionName.lastIndexOf('.')
    page = actionName.substring(0, index)
    actionName = actionName.substring(index+1)
  }
  if (!page) throw new Error('no page name')
  const state = getCurrentPageState(com, page)
  if (!state) return
  const actions = state.actions
  if (!actions) return
  const action: (IFlow | string)[] = actions[actionName]
  if (action?.length) {
    FlowModule.startRunFlow()
    for (let i = 0, l = action.length; i < l; i++) {
      if (!FlowModule.run) break
      const item = action[i]
      if (typeof item === 'string') {
        await runFlowByActionName(com, item, previous)
      } else {
        previous = await runFlow(com, state, item as IFlow, page, previous)
      }
    }
  }
}

// 通过该函数去调用 runFlowByFile -- 解析 request 的参数信息
async function runFlow (com: any, state: any, flow: IFlow, page: string, previous?: any) {
  const { name: filePath, ...args } = flow
  const data = com.state.node || com.state.data  
  if (data) FlowModule.addPageData({ page, data })
  const { url, method, response, target, required, path, from, next } = args
  const inputs = {
    url: url,
    method: method?.toUpperCase(),
    params: {},
    client: state,
    clientServer: response,
    target,
    com,
    required,
    path,
    data,
    page,
    previous,
    from,
    next
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

function getCurrentPageState(com: BaseVue, page: string) {
  const path = com.path
  const pagePath = `${path.substring(0, path.indexOf('['))}[${page}].state`
  const state = com.getAnyStateByPath(pagePath)
  return state
}