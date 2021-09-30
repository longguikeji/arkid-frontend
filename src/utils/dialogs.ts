import { BasePage } from '@/flows/page/base/nodes/pageNode'

export function addInputListDialog(state: BasePage, page: string) {
  state.dialogs![page] = {
    visible: false,
    page
  }
  state.actions![`close${page}`] = [
    {
      name: 'arkfbp/flows/assign',
      response: {
        [`dialogs.${page}.visible`]: false
      }
    }
  ]
  state.actions!.initInputList = [
    {
      name: 'flows/common/inputList/init'
    }
  ]
}