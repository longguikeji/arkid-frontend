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

// isExternal
export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

// 判断是否为数组类型
export function isArray(arg: any): boolean {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

// 判断某个字符串是否可以转回为数字类型
export function stringConvertNumber(str: string): string | number {
  const num = Number(str)
  if (!isNaN(num)) {
    return num
  } else {
    return str
  }
}

// 删除数组中的某个指定元素
export function deleteValueInArray(arr: any[], value: any): any[] {
  const index = arr.indexOf(value)
  if (arr.length > 0 && index !== -1) {
    arr.splice(index, 1)
  }
  return arr
}

// 判断是否为对象类型
export function isObject(obj: any): boolean {
  return Object.prototype.toString.call(obj) === '[object Object]'
}