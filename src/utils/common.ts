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

export function firstToUpperCase(str: string): string {
  return str.trim().toLowerCase().replace(str[0], str[0].toUpperCase())
}