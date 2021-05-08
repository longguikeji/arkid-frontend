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
          type: "ListAssembly",
          state: {
            treePage: {
              list: {
                header: {
                  title: '',
                  buttons: []
                },
                data: {
                  items: []
                }
              }
            },
            tablePage: {
              list: {
                header: {
                  title: '',
                  buttons: []
                },
                data: {
                  items: []
                }
              }
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
    return {}
  }
}