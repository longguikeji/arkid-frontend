<template>
  <div style="width:500px;display:inline-block">
    <el-slider
      v-model="state.value"
      :min="state.min"
      :max="state.max"
      :disabled="state.disabled"
      :step="state.step"
      :show-input="state.showInput"
      :show-input-controls="state.showInputControls"
      :input-size="state.inputSize"
      :show-stops="state.showStops"
      :show-tooltip="state.showTooltip"
      :range="state.range"
      :vertical="state.vertical"
      :height="state.height"
      :label="state.label"
      :debounce="state.debounce"
      :tooltip-class="state.tooltipClass"
      :marks="state.marks"
      :format-tooltip="formatTooltip"
    />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import SliderState from './SliderState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'Slider',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): SliderState {
    return this.$state as SliderState
  }

  formatTooltip() {
    // console.log(this.state.value);
  }
}
</script>

<style lang="scss" scoped></style>
