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

// 判断是否为对象类型
export function isEmptyObject(obj: Object): boolean {
  const keys = Object.keys(obj)
  return keys.length === 0
}

// 阻止复制操作
export function preventPaste(e: Event, name: string) {
  if (name.includes('password')) {
    e.preventDefault()
    return false
  }
}

export function processUUId(uuid: string) {
  if (!uuid || typeof uuid !== 'string') return
  uuid = uuid.replace(/-/g, '')
  return uuid
}

export function underlineConvertUpperCamel(value: string) {
  if (value.indexOf('_') < 0) return value
  let valueSplit = value.split('_')
  for (let i = 0, l = valueSplit.length; i < l; i++) {
    let vs = valueSplit[i]
    valueSplit[i] = vs[0].toUpperCase() + vs.substring(1)
  }
  return valueSplit.join('')
}