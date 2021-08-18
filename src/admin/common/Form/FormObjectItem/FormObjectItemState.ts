import FormItemState from '../FormItem/FormItemState'
import FormState from '../FormState'
import Vue from 'vue'

export default class FormObjectItemState implements FormState {
  items?:{[prop:string]:FormItemState}
  isAddItem?: boolean
  
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
      data[item.prop] = item.type === 'FormObjectItem' ? this.getValue(item.state.items) : item.state.value || ''
    }
    return data
  }

  private setValue(value: Object | string, items?: { [prop: string]: FormItemState}) {
    if (!items) return
    const keys = Object.keys(items)
    const valueKeys = Object.keys(value)
    if (valueKeys.length && !keys.length) {
      for (const key of valueKeys) {
        Vue.set(items, key, {
          prop: key,
          label: key,
          type: 'Input',
          state: {
            value: value[key]
          }
        })
      }
    } else {
      for (const prop in items) {
        const item = items[prop]
        const v = typeof value === 'object' ? value[prop] : value
        if (item.type === 'FormObjectItem') {
          this.setValue(v, item.state.items)
        } else {
          item.state.value = v
        }
      }
    }
  }
}