export default function getDataByPath(data: any, path: string):any {
  // path: a.b[0].c[key=value]
  let temp = data
  let key = ''
  for (const p of path) {
    switch (p) {
      case '.':
      case '[':
        if (key === '') break
        temp = getTemp(temp, key)
        key = ''
        break
      case ']':
        if (key.includes('=')) {
          const kv = key.split('=')
          const k = kv[0]
          const v = kv[1]
          for (const d of temp) {
            if (d[k] === v) {
              temp = d
              break
            }
          }
        } else {
          temp = getTemp(temp, Number(key))
        }
        key = ''
        break
      default:
        key += p
        break
    }
  }
  if (key !== '') {
    temp = getTemp(temp, key)
  }
  return temp
}

function getTemp(temp: any, key: string|number) {
  if (!temp) {
    return {}
  }

  return temp[key]
}