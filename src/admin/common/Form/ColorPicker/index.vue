<template>
  <el-color-picker
    v-model="state.value"
    :disabled="state.disabled"
    :size="state.size"
    :show-alpha="state.showAlpha"
    :color-format="state.colorFormat"
    :popper-class="state.popperClass"
    :predefine="state.predefine"
  />
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ColorPickerState from './ColorPickerState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'ColorPicker',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): ColorPickerState {
    return this.$state as ColorPickerState
  }
}
</script>

<style lang="scss" scoped></style>
