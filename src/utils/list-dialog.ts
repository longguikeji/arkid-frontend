import { FormPage } from '@/admin/FormPage/FormPageState'

export default function whetherImportListDialog(formData: FormPage) {
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
        visible: false,
        width: '70%',
        title: '',
        data: {},
        state: {
          type: '',
          state: {
            list: {
              header: {
                title: '',
                buttons: []
              },
              data: []
            }
          }
        },
        buttons: [
          {
            label: '确认所选',
            type: 'primary',
            action: 'confirm'
          }
        ]
      }
    }
    return null
  }
}