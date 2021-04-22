import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'

export default interface FormItemState extends AdminComponentState {
    label?: string // 标签文本
    labelWidth?: string // 表单域标签的的宽度，例如 '50px'。支持 auto。
    size?: string // 用于控制该表单域下组件的尺寸  medium / small / mini
    prop?: any // 表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的
    required?: boolean // 是否必填，如不设置，则会根据校验规则自动生成
    rules?: object // 表单验证规则
    error?: string // 表单域验证错误信息, 设置该值会使表单验证状态变为error，并显示该错误信息
    showMessage?: boolean // 是否显示校验错误信息
    inlineMessage?: boolean // 以行内形式展示校验信息
    isSetWidth?: boolean // 是否设置宽度值
}
