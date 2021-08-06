import FormItemState from '../FormItem/FormItemState'
import FormState from '../FormState'

export default class FormObjectItemState implements FormState {
  items?:{[prop:string]:FormItemState}
  isAddItem?: boolean
  
  public get value() {
    const data = {}
    if (!this.items) return data
    for (const prop in this.items) {
      const item = this.items[prop]
      data[item.prop] = item.state.value
    }
    return data
  }

  public set value(v:object|string) {
    if (!this.items) return
    if (typeof v === 'object') {
      for (const prop in this.items) {
        const item = this.items[prop]
        item.state.value = v[prop]
      }
    } else {
      for (const prop in this.items) {
        const item = this.items[prop]
        let value = v
        if (!value) {
          value = item.state.default
        }
        item.state.value = value
      }
    }
  }
}
