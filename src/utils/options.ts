import SelectState from '@/admin/common/Form/Select/SelectState'

export function setOptions(selectState: SelectState) {
  let { value, options, multiple } = selectState
  if (!value) return
  options!.length = 0
  value.forEach((item, index) => {
    options!.push({ value: item.uuid, label: item.name })
    multiple ? value.splice(index, 1, item.uuid) : value = item.uuid
  })
}
