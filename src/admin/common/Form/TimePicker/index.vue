<template>
  <div>
    <el-time-picker
      v-if="state.isRange"
      v-model="state.value"
      :readonly="state.readonly"
      :disabled="state.disabled"
      :editable="state.editable"
      :clearable="state.clearable"
      :size="state.size"
      :placeholder="state.placeholder"
      :start-placeholder="state.startPlaceholder"
      :end-placeholder="state.endPlaceholder"
      :is-range="state.isRange"
      :arrow-control="state.arrowControl"
      :align="state.align"
      :popper-class="state.popperClass"
      :picker-options="state.pickerOptions"
      :range-separator="state.rangeSeparator"
      :value-format="state.valueFormat"
      :default-value="state.defaultValue"
      :name="state.name"
      :prefix-icon="state.prefixIcon"
      :clear-icon="state.clearIcon"
    />
    <el-time-select
      v-else
      v-model="state.value"
      :readonly="state.readonly"
      :disabled="state.disabled"
      :editable="state.editable"
      :clearable="state.clearable"
      :size="state.size"
      :placeholder="state.placeholder"
      :start-placeholder="state.startPlaceholder"
      :end-placeholder="state.endPlaceholder"
      :align="state.align"
      :popper-class="state.popperClass"
      :picker-options="state.pickerOptions"
      :range-separator="state.rangeSeparator"
      :value-format="state.valueFormat"
      :default-value="state.defaultValue"
      :name="state.name"
      :prefix-icon="state.prefixIcon"
      :clear-icon="state.clearIcon"
    />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import TimeSelectState from './TimeSelectState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'Time',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): TimeSelectState {
    return this.$state as TimeSelectState
  }
}
</script>

<style lang="scss" scoped>
::v-deep.el-date-editor .el-range-separator {
  padding: 0px;
}
</style>
