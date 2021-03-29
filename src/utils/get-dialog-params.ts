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
