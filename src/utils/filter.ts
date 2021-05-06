export default function Filter(strEquality: string, state: any): number {
  let index: number = 0
  const leftBracketIndex = strEquality.indexOf('[')
  const rightBracketIndex = strEquality.indexOf(']')
  const arrayStateMapping = strEquality.slice(leftBracketIndex + 1, rightBracketIndex)
  const arrayStateMappingSpilt = arrayStateMapping.split('=')
  const representKey = arrayStateMappingSpilt[0]
  const representValue = arrayStateMappingSpilt[1]
  const requiredStateKey = strEquality.substring(0, leftBracketIndex)
  state[requiredStateKey].forEach((item: any, idx: number) => {
    if (item[representKey] === representValue) {
      index = idx
    }
  })
  return index
}