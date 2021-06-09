// 获取某个字符串中出现某个字符的索引值集
export function getOneCharacterIndexsInString(str: string, character: string): Array<number> {
  const indexs: Array<number> = []
  for (let i = 0; i < str.length; i++) {
    if (str[i] === character) {
      indexs.push(i)
    }
  }
  return indexs
}

// 将以短横线连接的字符串改为小驼峰的格式
export function underlinedStrToUpperCamelStr(str: string): string {
  if (str.includes('_')) {
    str = str.toLowerCase()
    const splitStr = str.split('_')
    for (let i = 0; i < splitStr.length; i++) {
      let iStr = splitStr[i]
      splitStr[i] = iStr.charAt(0).toUpperCase() + iStr.slice(1)
    }
    str = splitStr.join('')
  }
  return str
}

// 判断A数组是否包含B数组，A >= B
export function firstArrContainSecondArr<T>(firstArr: Array<T>, secondArr: Array<T>): boolean {
  let isContain = true
  if(!(firstArr instanceof Array) || !(secondArr instanceof Array)) return false
  if(firstArr.length < firstArr.length) return false
  for(let i = 0, len = secondArr.length; i < len; i++){
    if(firstArr.indexOf(secondArr[i]) < 0) {
      isContain = false
      break
    }
  }
  return isContain
}


// 获取某个对象的所有keys
export function getObjAllKeys(obj: Object) {
  const keys: Array<string> = []
  keys.push.apply(keys, Object.keys(obj))
  for (let i = 0, len = keys.length; i < len; i++) {
    if (Object.prototype.toString.call(obj[keys[i]]) === '[object Object]') {
      const deepKeys = getObjAllKeys(obj[keys[i]])      
      keys.push.apply(keys, deepKeys)
    }
  }
  return keys
}
