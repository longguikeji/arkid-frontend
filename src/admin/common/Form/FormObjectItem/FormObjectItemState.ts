import FormItemState from '../FormItem/FormItemState'
import FormState from '../FormState'
import Vue from 'vue'
import { isBoolean } from 'lodash'

export default class FormObjectItemState implements FormState {
  items?: { [prop: string]: FormItemState }
  isAddItem?: boolean
  data?: any
  init?: {
    path: string
    method: string
  }

  public get value() {
    return this.getValue(this.items)
  }

  public set value(value: Object | string) {
    this.setValue(value, this.items)
  }

  private getValue(items?: { [prop: string]: FormItemState }) {
    const data = {}
    if (!this.items) return data
    for (const prop in items) {
      const item = items[prop]
      const { value: v, default: d, items: c } = item.state
      data[item.prop] =
        item.type === 'FormObjectItem'
          ? this.getValue(c)
          : v === undefined
          ? d
          : v
    }
    return data
  }

  private setValue(
    value: Object | string,
    items?: { [prop: string]: FormItemState },
  ) {
    this.data = value
    if (!items) return
    const keys = Object.keys(items)
    const valueKeys = Object.keys(value)
    if (this.isAddItem) {
      if (valueKeys.length && !keys.length) {
        for (const key of valueKeys) {
          Vue.set(items, key, {
            prop: key,
            label: key,
            type: 'Input',
            state: {
              value: value[key],
            },
          })
        }
      }
    } else {
      for (let prop in items) {
        const item = items[prop]
        const { link, options, items: cItems, value: itemVaule } =
          item.state || {}
        let v = typeof value === 'object' ? value[prop] : value
        if (link && options) {
          options.push({
            value: v,
            label: typeof value === 'object' ? value[link] : value,
          })
        }
        if (link) prop = link
        if (item.type === 'FormObjectItem') {
          this.setValue(v, cItems)
        } else {
          item.state.value = isBoolean(itemVaule) ? Boolean(v) : v
        }
      }
    }
  }
}
