import FormPageState from '@/admin/FormPage/FormPageState'

export default function getDialogParams(formPage: FormPageState) {
  const params = {}
  let items
  if (formPage.select && formPage.forms) {
    items = formPage.forms[formPage.select.value].items!
    params[formPage.select.valueKey!] = formPage.select.value
  } else if (formPage.form) {
    items = formPage.form.items!
  }
  for (const prop in items) {
    const value = items[prop].state.value
    if (value) {
      params[prop] = items[prop].state.value
    }
  }
  return params
}

// 该函数功能为 ==> 生成FormPage类型的Dialog对话框执行Flow流文件时需要的request请求数据配置内容
// formPage 为传入的 Dialog-State，prefix 指明当前是哪一个弹出框
// prefix 内容为 dialog.xxx  比如  dialog.create
export function getFormPageDialogRequestConfig(formPage: FormPageState, prefix: string) {
  if (!/(\.state)$/.test(prefix)) { prefix = prefix + '.state'}
  const params = {}
  if (formPage.select && formPage.forms) {
    params[formPage.select.valueKey!] = prefix + 'select.value'
  } else if (formPage.form) {
    const items = formPage.form.items!
    for (const prop in items) {
      params[prop] = prefix + '.form.items[prop=]' + prop + '.state.value'
    }
  }
  return params
}