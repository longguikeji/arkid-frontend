import { IPage } from '@/flows/basePage/nodes/pageNode'

export function getImportBtnMapping(state: IPage): string {
  let importMapping  = ''
  const btns = state.card?.buttons
  if (btns) {
    for (let i = 0, len = btns.length; i < len; i++) {
      const btn = btns[i]
      if (btn.label === '导出' || btn.label === 'export') {
        importMapping = `card.buttons[${i}].disabled`
      }
    }
  }
  return importMapping
}