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
        if (key.includes('=')) {
          // ...
        } else {
          temp = temp[key] || {}
        }
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