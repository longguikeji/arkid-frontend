<template>
  <span v-if="state.readonly">{{ state.value }} </span>
  <div v-else>
    <el-input
      v-model="state.value"
      :type="state.type"
      :maxlength="state.maxlength"
      :minlength="state.minlength"
      :show-word-limit="state.showWordLimit"
      :placeholder="state.placeholder"
      :clearable="state.clearable || true"
      :show-password="state.showPassword"
      :disabled="state.disabled"
      :size="state.size"
      :rows="state.rows"
      :autosize="state.autosize"
      :autocomplete="state.autocomplete"
      @blur="onBlur"
    />
    <svg-icon
      v-if="state.required"
      class="required"
      name="required"
      width="20"
      height="20"
    />
    <div
      v-if="hint"
      class="error-hint"
    >
      {{ hint }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import InputState from './InputState'
import BaseVue from '@/admin/base/BaseVue'
import { formateValidator } from '@/utils/rules'
import { ValidateModule } from '@/store/modules/validate'

@Component({
  name: 'Input',
  components: {}
})
export default class extends Mixins(BaseVue) {
  private hint = ''

  get state(): InputState {
    return this.$state as InputState
  }

  async onBlur() {
    let { name, value, format, hint, required } = this.state
    if (!format) format = 'other'
    if (!hint) hint = '请输入正确格式'
    formateValidator(value, format, hint, required).then((err) => {
      if (err) {
        this.hint = hint || ''
        ValidateModule.addInvalidItem(name)
      } else {
        this.hint = ''
        ValidateModule.deleteInvalidItem(name)
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.row {
  display: flex;
}
.col {
  margin: 12px;
  flex: auto;
}
.error-hint {
  color: #f53e3e;
  position: absolute;
  font-size: 12px;
}
</style>
