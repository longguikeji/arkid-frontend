import SelectState from '@/admin/common/Form/Select/SelectState'
import { isArray } from 'lodash'

export function setOptions(selectState: SelectState) {
  let { value, options, multiple } = selectState
  if (!value) return
  options!.length = 0
  if (typeof value === 'string') {
    options!.push({
      value: value,
      label: value
    })
  } else if (isArray(value)) {
    value.forEach((item, index) => {
      options!.push({ value: item.uuid, label: item.name })
      multiple ? selectState.value.splice(index, 1, item.uuid) : selectState.value = item.uuid
    })
  } else {
    options!.push({
      value: value.uuid,
      label: value.name
    })
    selectState.value = value.uuid
  }
}
