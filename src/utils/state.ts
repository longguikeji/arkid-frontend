// path: a.b[0].c[key=value]
export default function getStateByPath(state: any, path: string): any {
  let temp = state
  let key: string = ''
  for (const p of path) {
    if (!temp) break
    const t = temp
    switch (p) {
      case '[':
        if (!key) break
        temp = temp[key] || {}
        key = '['
        break
      case ']':
        key = key.substring(1)
        temp = temp[key] || {}
        key = ''
        break
      case '.':
        if (!key) break
        temp = temp[key]
        if (!temp) {
          temp = t
          key += p
        } else {
          key = ''
        }
        break
      default:
        key += p
    }
  }
  if (key && temp) temp = temp[key] || {}
  return temp
}

// 根据path属性, 获取页面名称
export function getPageNameByPath(path: string): string {
  path = path.substring(0, path.indexOf('.state'))
  path = `${path.replace(/[\[]/g, '.').replace(/[\]]/g, '')}`
  const keys = path.split('.')
  const pageKeys = keys.filter((_, index) => index > 1)
  return pageKeys.join('.')
}