import ButtonState from '@/admin/common/Button/ButtonState'

export function setButtonStatus(state: Array<ButtonState>, disabled: boolean) {
  state.forEach(btn => {
    if (btn.action) {
      if (btn.action[0].name.indexOf('export') > 0 ) {
        btn.disabled = disabled
      }
    }
  })
}