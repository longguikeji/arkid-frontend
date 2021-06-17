import { isArray, stringConvertNumber } from '@/utils/common'

export default function stateFilter(strEquality: string, state: any): number | string {
  let secondKey: number | string = 0
  const leftBracketIndex = strEquality.indexOf('[')
  const rightBracketIndex = strEquality.indexOf(']')
  const arrayStateMapping = strEquality.slice(leftBracketIndex + 1, rightBracketIndex)
  if (arrayStateMapping.indexOf('=') < 0) {
    secondKey = stringConvertNumber(arrayStateMapping)
  } else {
    const arrayStateMappingSpilt = arrayStateMapping.split('=')
    const representKey = arrayStateMappingSpilt[0]
    const representValue = arrayStateMappingSpilt[1]
    const requiredStateKey = strEquality.substring(0, leftBracketIndex)
    const target = state[requiredStateKey]
    if (isArray(target)) {
      for (let i = 0, len = target.length; i < len; i++) {
        if (target[i][representKey] === representValue) {
          secondKey = i
          break
        }
      }
    }
  }
  return secondKey
}