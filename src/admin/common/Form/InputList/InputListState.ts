import SelectState from '../Select/SelectState'

export default interface InputListState extends SelectState {
  data?: any // 存放InputList初始化时所依赖的一些内容
}
