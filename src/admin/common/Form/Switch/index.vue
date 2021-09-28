<template>
  <el-switch
    v-model="state.value"
    style="display: block"
    :disabled="state.disabled"
    :width="state.width"
    :active-icon-class="state.activeIconClass"
    :inactive-icon-class="state.inactiveIconClass"
    :active-text="state.activeText"
    :inactive-text="state.inactiveText"
    :active-value="state.activeValue"
    :inactive-value="state.inactiveValue"
    :active-color="state.activeColor"
    :inactive-color="state.inactiveColor"
    :name="state.name"
    :validate-event="state.validateEvent"
    @change="switchChange"
  />
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import SwitchState from './SwitchState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'SwitchForm',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): SwitchState {
    return this.$state as SwitchState
  }

  switchChange() {
    if (this.state.action) {
      this.runAction(this.state.action)
    }
  }
}
</script>

<style lang="scss" scoped></style>
