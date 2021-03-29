<template>
  <el-date-picker
    v-model="state.value"
    :readonly="state.readonly"
    :disabled="state.disabled"
    :editable="state.editable"
    :clearable="state.clearable"
    :size="state.size"
    :placeholder="state.placeholder"
    :start-placeholder="state.startPlaceholder"
    :end-placeholder="state.endPlaceholder"
    :type="state.type"
    :format="state.format"
    :align="state.align"
    :popper-class="state.popperClass"
    :picker-options="state.pickerOptions"
    :range-separator="state.rangeSeparator"
    :default-value="state.defaultValue"
    :value-format="state.valueFormat"
    :name="state.name"
    :unlink-panels="state.unlinkPanels"
    :prefix-icon="state.prefixIcon"
    :clear-icon="state.clearIcon"
    :validate-event="state.validateEvent"
  />
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import DatePickerState from './DatePickerState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'DatePicker',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): DatePickerState {
    return this.$state as DatePickerState
  }
}
</script>
<style lang="scss" scoped>
::v-deep.el-date-editor .el-range-separator {
  padding: 0px;
}
</style>
