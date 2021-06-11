import { getOneCharacterIndexsInString } from '@/utils/common'
import getDataByPath from '@/utils/datapath'

export function getPageState(baseState: any, path: string) {
  let state = getDataByPath(baseState, path)
  const isMultiPageState = state?.type === 'TablePage' || state?.type === 'FormPage' || state?.type === 'TreePage' || state?.type === 'DashboardPage'
  if (isMultiPageState) {
    state = state.state
  } else {
    state = null
  }
  return state
}

export function getCurrentPageState(baseState: any, path: string) {
  let tempState
  let spiltPath = path.split('.')
  if (spiltPath.length === 3) {
    spiltPath.pop()
  }
  const newPath = spiltPath.join('.')
  if (newPath) {
    const indexs = getOneCharacterIndexsInString(newPath, '.')
    const pathMapping: Array<string> = []
    pathMapping.push(newPath)
    for (let i = indexs.length - 1; i >= 1; i--) {
      const iPath = newPath.substring(0, indexs[i])
      pathMapping.push(iPath)
    }
    for (let i = 0; i <= pathMapping.length - 1; i++) {
      const state = getPageState(baseState, pathMapping[i])
      if (state) {
        tempState = state
        break
      }
    }
  }
  return tempState
}
