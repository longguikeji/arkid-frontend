<template>
  <el-popover
    :trigger="state.trigger"
    :title="state.title"
    :content="state.content"
    :width="state.width"
    :placement="state.placement"
    :disabled="state.disabled"
    :value="state.value"
    :offset="state.offset"
    :transition="state.transition"
    :visible-arrow="state.visibleArrow"
    :popper-options="state.popperOptions"
    :popper-class="state.popperClass"
    :open-delay="state.openDelay"
    :close-delay="state.closeDelay"
    :tabindex="state.tabindex"
  >
    <el-button slot="reference">
      {{ state.btn }}
    </el-button>
  </el-popover>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import PopoverState from './PopoverState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'Popover'
})
export default class extends Mixins(BaseVue) {
  get state(): PopoverState {
    return this.$state as PopoverState
  }
}
</script>
<style lang="scss" scoped></style>
