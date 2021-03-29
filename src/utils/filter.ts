export default function Filter(v: any, vd: any): number {
  const m = /=(\S*)]/
  const fv = v.match(m)[1]
  const attr = v.replace(fv, '').replace('[prop=]', '')
  let outcome = 0
  vd[attr].forEach((vditem: any, vdindex: number) => {
    if (vditem.prop === fv) {
      outcome = vdindex
    }
  })
  return outcome
}