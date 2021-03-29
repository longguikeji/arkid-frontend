<template>
  <el-checkbox-group
    v-model="state.value"
    class="check"
  >
    <template v-if="state.checkBox">
      <el-checkbox
        v-for="(item, index) in state.checkBox"
        :key="index"
        :value="item.value"
        :label="item.label"
        :true-label="item.trueLabel"
        :false-label="item.falseLabel"
        :disabled="item.disabled"
        :border="item.border"
        :size="item.size"
        :name="item.name"
        :checked="item.checked"
        :indeterminate="item.indeterminate"
      >
        {{ item.content }}
      </el-checkbox>
    </template>
    <template v-else-if="state.checkButton">
      <el-checkbox-button
        v-for="(item, index) in state.checkButton"
        :key="index"
        :label="item.label"
        :true-label="item.trueLabel"
        :false-label="item.falseLabel"
        :disabled="item.disabled"
        :name="item.name"
        :checked="item.checked"
      >
        {{ item.content }}
      </el-checkbox-button>
    </template>
  </el-checkbox-group>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import CheckBoxGroupState from './CheckBoxGroupState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'CheckBoxGroup',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): CheckBoxGroupState {
    return this.$state as CheckBoxGroupState
  }
}
</script>
<style lang="scss" scoped>
.check {
  display: inline-block;
}
</style>
