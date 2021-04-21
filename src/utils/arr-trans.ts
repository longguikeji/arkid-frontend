export default function arrTrans(arr: Array<any>, num: number): Array<any> {
  if (arr.length === 0) return arr
  const arrTrans = new Array()
  if (num === 0 || num === 1) {
    arrTrans[0] = arr
  } else {
    const dimensionCapacity = Math.ceil(arr.length / num)
    arr.forEach((item, index) => {
      const arrTransIndex = Math.floor(index / dimensionCapacity)
      if (!arrTrans[arrTransIndex]) {
        arrTrans[arrTransIndex] = []
      }
      arrTrans[arrTransIndex].push(item)
    })
  }
  return arrTrans
}
