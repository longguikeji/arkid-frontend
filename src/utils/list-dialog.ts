import FormPageState from '@/admin/FormPage/FormPageState'

export default function whetherImportListDialog(formData: FormPageState) {
  if (formData.form && formData.form.items) {
    let flag = false
    const items = formData.form.items
    for (const prop in items) {
      if (items[prop].type === 'InputList') {
        flag = true
        break
      }
    }
    if (flag) {
      return {
        type: "ListAssembly",
        visible: false,
        title: '',
        data: {},
        state: {
          treePage: null,
          tablePage: null,
          selected: {
            header: {
              title: ''
            },
            list: {
              items: [],
            },
          }
        },
        actions: [
          {
            label: '确认所选',
            action: [
              {
                name: 'flows/list/confirm',
                params: {
                  path: ''
                }
              }
            ],
            type: 'primary'
          }
        ]
      }
    }
    return {}
  }
}