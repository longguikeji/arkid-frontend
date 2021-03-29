import { BaseState } from '@/admin/base/BaseVue'

interface ListItems {
  label: string | number;
  value: string | number
}

export default interface ListState extends BaseState {
  items: Array<ListItems>
}
