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
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import InputState from './InputState'
import BaseVue from '@/admin/base/BaseVue'
import { getRegexRule, RULES } from '@/utils/rules'
import AsyncValidator from 'async-validator'

@Component({
  name: 'Input',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): InputState {
    return this.$state as InputState
  }

  onBlur() {
    if (this.state.value && this.state.format) {
      // const { prop, value, format, hint } = this.state
      // let rule = RULES[prop!]
      // const descriptor = { [prop!]: {} }
      // descriptor[prop!] = Object.assign({} ,rule, { message: hint})
      // const target = { [prop!]: value }
      // const validator = new AsyncValidator(descriptor)
      // validator.validate(target).then((data) => {
      //   debugger
      //   console.log(data)
      // }).catch((err) => {
      //   debugger
      //   console.log(err)
      // })
    }
  }

  // handleErrors(errors, fields) {

  // }
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
</style>
