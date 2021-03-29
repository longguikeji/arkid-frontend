<template>
  <el-rate
    v-model="state.value"
    style="display:inline-block"
    :max="state.max"
    :disabled="state.disabled"
    :allow-half="state.allowHalf"
    :low-threshold="state.lowThreshold"
    :high-threshold="state.highThreshold"
    :colors="state.colors"
    :void-color="state.voidColor"
    :disabled-void-color="state.disabledVoidColor"
    :icon-classes="state.iconClasses"
    :void-icon-class="state.voidIconClass"
    :disabled-void-icon-class="state.disabledVoidIconClass"
    :show-text="state.showText"
    :show-score="state.showScore"
    :text-color="state.textColor"
    :texts="state.texts"
    :score-template="state.scoreTemplate"
  />
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import RateState from './RateState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'Rate',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): RateState {
    return this.$state as RateState
  }
}
</script>

<style lang="scss" scoped></style>
