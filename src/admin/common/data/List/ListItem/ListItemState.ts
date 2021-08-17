export default interface ListItemState {
  label: string
  value: string | number
  action?: string | Function
  index?: number
  isShowDelete?: boolean
}
